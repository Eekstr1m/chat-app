import { Response } from "express";
import {
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../types/ReqResTypes.js";
import { GetUserAuthInfoRequestI } from "../middlewares/authVerification.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { MessageResponseI } from "../interfaces/MessageInterfaces.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import User from "../models/user.model.js";
import { isValidObjectId } from "mongoose";

// Convert userName as id to valid id
const getValidReceiverId = async (receiverId: string) => {
  if (isValidObjectId(receiverId)) {
    return receiverId;
  } else {
    const receiver = await User.findOne({ userName: receiverId }).select("_id");
    if (!receiver) return null;
    return receiver._id;
  }
};

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
    const { message, contentType } = req.body;
    const { id } = req.params;
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const senderId = req.user._id.toString();

    // Get valid receiver id
    const receiverId = await getValidReceiverId(id);
    if (receiverId === null)
      return res.status(400).json({ error: "User not found" });

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
      contentType,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Socket io to send the message to the receiver
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);

      // Socket io to send emit to receiver for first message in chat
      if (conversation.messages.length === 1) {
        // Set follow status for receiver when get first message
        const receiver = await User.findOneAndUpdate(
          { _id: receiverId },
          { $addToSet: { followedParticipants: senderId } },
          { new: true }
        ).select("-password");
        io.to(receiverSocketId).emit("firstMessage", receiver);
      }
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
    const { id } = req.params;
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const senderId = req.user._id;

    // Get valid receiver id
    const receiverId = await getValidReceiverId(id);
    if (receiverId === null)
      return res.status(400).json({ error: "User not found" });

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

    if (message) {
      // Send notification about message status change via socket
      const receiverSocketId = getReceiverSocketId(message.senderId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageRead", message);
      }
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in update message controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (
  req: GetMessagesRequestI,
  res: Response
) => {
  try {
    const { id: messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const senderSocketId = getReceiverSocketId(message.senderId.toString());
    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());

    if (senderSocketId) {
      io.to(senderSocketId).emit("messageDeleted", { messageId });
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }

    // Remove message reference from conversation
    await Conversation.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in delete message controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
