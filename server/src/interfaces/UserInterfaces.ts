import mongoose from "mongoose";

export interface UserRequestSignupBodyI {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface UserRequestLoginBodyI {
  userName: string;
  password: string;
}

export interface UserSchemaModelI {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  avatar: string;
  followedParticipants: Array<string>;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface UserResponseI {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatar: string;
  followedParticipants: Array<string>;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
