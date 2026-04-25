import { ConnectMongoDb } from "./Config/db.js";
import { configDotenv } from "dotenv";
import express from 'express'
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import User from './models/UserData.js';

configDotenv()
ConnectMongoDb()

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/studysync', (req, res) => {
  res.send('hello from the server')
})

// Socket.io logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_online', async (email) => {
    if (email) {
      await User.findOneAndUpdate({ email }, { onlineStatus: 'online' });
      socket.userEmail = email;
      io.emit('status_change', { email, status: 'online' });
    }
  });

  socket.on('disconnect', async () => {
    if (socket.userEmail) {
      await User.findOneAndUpdate({ email: socket.userEmail }, { onlineStatus: 'offline' });
      io.emit('status_change', { email: socket.userEmail, status: 'offline' });
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`)
})






