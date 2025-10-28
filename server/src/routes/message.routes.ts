import { Router } from "express";
import {
  deleteMessage,
  getMessages,
  getUnreadMessages,
  sendMessage,
  updateMessage,
} from "../controllers/message.controller.js";
import authVerification from "../middlewares/authVerification.js";

export const getMessageRoutes = () => {
  const router = Router();

  router.get("/unread", authVerification, getUnreadMessages);
  router.get("/:id", authVerification, getMessages);
  router.post("/send/:id", authVerification, sendMessage);
  router.put("/read/:id", authVerification, updateMessage);
  router.delete("/delete/:id", authVerification, deleteMessage);
  return router;
};
