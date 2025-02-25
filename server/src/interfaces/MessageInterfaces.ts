import mongoose from "mongoose";

export interface MessageResponseI {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
