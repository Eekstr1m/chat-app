import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    // origin: process.env.CORS_ORIGIN,
    // allow all origins
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

interface UserSocketMap {
  [key: string]: string;
}

const userSocketMap: UserSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (userId: string) => {
  return userSocketMap[userId];
};

io.on("connection", async (socket) => {
  // Handle connection
  console.log("a user connected", socket.id);

  // Get userId from query
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send online users to the client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnect
  socket.on("disconnect", async () => {
    console.log("a user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      // Update last online time and get updated user
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { lastOnline: Date.now() },
        { new: true }
      ).select("-password");

      // Emit offline event to all users
      io.emit("userOffline", updatedUser);
    }
  });
});
