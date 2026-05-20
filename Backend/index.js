import { ConnectMongoDb } from "./Config/db.js";
import { configDotenv } from "dotenv";
import express from 'express'
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import User from './models/UserData.js';
import Session from './models/Session.js';
import aiRoutes from "./routes/aiRoutes.js";
import codeExecutionRoutes from './routes/codeExecutionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

configDotenv();
ConnectMongoDb();

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/invite', connectionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/code', codeExecutionRoutes);
app.use('/api/quiz', quizRoutes);

app.get("/studysync",(req,res)=>{
  res.send("hello from the server");
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set('io', io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user_online", async (data) => {
    const email = typeof data === 'string' ? data : data.email;
    const userId = data.userId;
    
    if (!email) return;
    await User.findOneAndUpdate({ email }, { onlineStatus: "online" });
    socket.userEmail = email;
    if (userId) {
      socket.join(userId);
      socket.currentUserId = userId;
      console.log(`User ${userId} joined their personal room`);
    }
    io.emit("status_change", { email, status: "online" });
  });

  socket.on("send_session_invitation", (data) => {
    io.to(data.receiverId).emit("new_session_invitation", data.notification);
  });

  socket.on("respond_to_invitation", (data) => {
    io.to(data.senderId).emit("invitation_response", { 
      status: data.status, 
      receiverId: data.receiverId,
      notification: data.notification 
    });
  });

  socket.on("join_chat", (invitationId) => {
    socket.join(invitationId);
    console.log(`User joined chat: ${invitationId}`);
  });

  socket.on("send_message", (message) => {
    io.to(message.invitationId).emit("receive_message", message);
  });

  socket.on("typing", (data) => {
    socket.to(data.invitationId).emit("user_typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.invitationId).emit("user_stop_typing", data);
  });

  socket.on("message_seen", (data) => {
    // data contains invitationId and userId
    socket.to(data.invitationId).emit("messages_marked_seen", data);
  });

  // --- Dynamic Group Study Session Events ---
  socket.on("join_study_session", (data) => {
    const { sessionId, userId, userEmail } = data;
    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.userId = userId;
    
    // Notify others in the room
    socket.to(sessionId).emit("participant_joined", { userId, userEmail });
    console.log(`User ${userId} joined study session: ${sessionId}`);
  });

  socket.on("send_session_message", (data) => {
    // data contains sessionId, senderId, message, timestamp
    io.to(data.sessionId).emit("receive_session_message", data);
  });

  socket.on("session_typing", (data) => {
    socket.to(data.sessionId).emit("user_session_typing", data);
  });

  socket.on("session_stop_typing", (data) => {
    socket.to(data.sessionId).emit("user_session_stop_typing", data);
  });

  // --- WebRTC Signaling (Room Based) ---
  socket.on("session_signal", (data) => {
    socket.to(data.sessionId).emit("session_signal", data);
  });

  socket.on("session_toggle_media", (data) => {
    socket.to(data.sessionId).emit("user_session_media_toggled", data);
  });

  // --- Whiteboard Sync (Room Based) ---
  socket.on("session_draw_stroke", (data) => {
    socket.to(data.sessionId).emit("session_draw_stroke", data);
  });

  socket.on("session_clear_whiteboard", (sessionId) => {
    socket.to(sessionId).emit("session_clear_whiteboard");
  });

  socket.on("leave_study_session", (data) => {
    const { sessionId, userId } = data;
    socket.leave(sessionId);
    socket.to(sessionId).emit("participant_left", { userId });
  });

  socket.on("disconnect", async () => {
    if (socket.sessionId) {
      socket.to(socket.sessionId).emit("participant_left", { userId: socket.userId });
    }
    
    if (!socket.userEmail) {
      console.log("User disconnected:", socket.id);
      return;
    }

    await User.findOneAndUpdate(
      { email: socket.userEmail },
      { onlineStatus: "offline" }
    );
    io.emit("status_change", { email: socket.userEmail, status: "offline" });
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
