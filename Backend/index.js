import { ConnectMongoDb } from "./Config/db.js";
import { configDotenv } from "dotenv";
import express from 'express'
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import User from './models/UserData.js';
import aiRoutes from "./routes/aiRoutes.js";

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

app.get("/studysync", (req, res) => {
  res.send("hello from the server");
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user_online", async (email) => {
    if (!email) return;
    await User.findOneAndUpdate({ email }, { onlineStatus: "online" });
    socket.userEmail = email;
    io.emit("status_change", { email, status: "online" });
  });

  socket.on("disconnect", async () => {
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
