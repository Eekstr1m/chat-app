import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// DB
import connectToMongo from "./db/connectToMongo.js";

// Socket
import { app, server } from "./socket/socket.js";

// Routes
import { getAuthRoutes } from "./routes/auth.routes.js";
import { getMessageRoutes } from "./routes/message.routes.js";
import { getUsersRoutes } from "./routes/users.routes.js";

// Initialize express app
dotenv.config();
// const app = express();
const PORT = process.env.PORT || 5001;

// Cors
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes middlewares
app.use("/api/auth", getAuthRoutes()); // Auth
app.use("/api/messages", getMessageRoutes()); // Messages
app.use("/api/users", getUsersRoutes()); // Users

// Start the server
server.listen(PORT, () => {
  connectToMongo();
  console.log(`Server is running on http://localhost:${PORT}`);
});
