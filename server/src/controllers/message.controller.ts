import { Response } from "express";
import {
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../types/ReqResTypes.js";
import { GetUserAuthInfoRequestI } from "../middlewares/authVerification.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { MessageResponseI } from "../interfaces/MessageInterfaces";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

type SendMessageRequestI = RequestWithParamsAndBody<
  { id: string },
  { message: string }
> &
  GetUserAuthInfoRequestI;

export const sendMessage = async (
  req: SendMessageRequestI,
  res: Response<MessageResponseI | { error: string }>
) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const senderId = req.user._id;

    // Get conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    // Create new conversation if it not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Sending a message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Socket io to send the message to the receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error send message controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

type GetMessagesRequestI = RequestWithParams<{ id: string }> &
  GetUserAuthInfoRequestI;

export const getMessages = async (req: GetMessagesRequestI, res: Response) => {
  try {
    const { id: receiverId } = req.params;
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const senderId = req.user._id;

    // Get conversation messages
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    // If conversation messages empty return empty array
    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in get messages controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnreadMessages = async (
  req: GetUserAuthInfoRequestI,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const userId = req.user._id;

    // Get all unread messages grouped by sender
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          receiverId: userId,
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert the result to an object { senderId: count }
    const result = unreadCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in get unread messages controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (
  req: GetMessagesRequestI,
  res: Response
) => {
  try {
    const { id: messageId } = req.params;
    // const { isRead } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in update message controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
