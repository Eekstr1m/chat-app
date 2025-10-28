import { Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateTokenAndCookie = (
  userId: mongoose.Types.ObjectId,
  res: Response
) => {
  if (process.env.JWT_SECRET) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
  } else return res.status(400).json({ error: "Something went wrong" });
};

export default generateTokenAndCookie;

export type MyToken = {
  userId: string;
};
