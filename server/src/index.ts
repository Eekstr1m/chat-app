import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import env variables
import "dotenv/config.js";

// DB
import connectToMongo from "./db/connectToMongo.js";

// Socket
import { app, server } from "./socket/socket.js";

// Routes
import { getAuthRoutes } from "./routes/auth.routes.js";
import { getMessageRoutes } from "./routes/message.routes.js";
import { getUsersRoutes } from "./routes/users.routes.js";

// Initialize express app
// const app = express();
const PORT = process.env.PORT || 5001;

// Cors
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  // allow all origins
  // origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

// Middlewares
// Increase limit for JSON and urlencoded bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.get("/api/hello", (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

// Routes middlewares
app.use("/api/auth", getAuthRoutes()); // Auth
app.use("/api/messages", getMessageRoutes()); // Messages
app.use("/api/users", getUsersRoutes()); // Users

// Start the server
server.listen(PORT, () => {
  connectToMongo();
  console.log(`Server is running on ${PORT} port`);
});
