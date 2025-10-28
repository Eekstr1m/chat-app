import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { RequestWithBody } from "../types/ReqResTypes.js";
import {
  UserRequestLoginBodyI,
  UserRequestSignupBodyI,
  UserResponseI,
} from "../interfaces/UserInterfaces.js";
import generateTokenAndCookie from "../utils/generateToken.js";
import generateUserResponse from "../utils/generateUserResponse.js";

export const signup = async (
  req: RequestWithBody<UserRequestSignupBodyI>,
  res: Response<UserResponseI | { error: string }>
) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    // Check if user with userName or email exists
    const checkUserName = await User.findOne({ userName });
    const checkEmail = await User.findOne({ email });
    if (checkUserName) {
      return res.status(400).json({ error: "User name already exists" });
    }
    if (checkEmail) {
      return res.status(400).json({ error: "This email already exists" });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Avatar placeholder
    // const avatarPlaceholder = `https://avatar.iran.liara.run/username?username=${userName}`;
    const avatarPlaceholder =
      process.env.R2_DEV_ENDPOINT + "/default-avatar.jpg";

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: passwordHash,
      avatar: avatarPlaceholder,
    });
    if (newUser) {
      // Generate JWT token
      generateTokenAndCookie(newUser._id, res);
      const savedUser = await newUser.save();

      return res.status(201).json(generateUserResponse(savedUser));
    } else return res.status(400).json({ error: "Invalid user data" });
  } catch (error) {
    console.error("Error signup controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (
  req: RequestWithBody<UserRequestLoginBodyI>,
  res: Response<UserResponseI | { error: string }>
) => {
  try {
    const { userName, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password comparing
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    generateTokenAndCookie(user._id, res);

    res.status(200).json(generateUserResponse(user));
  } catch (error) {
    console.error("Error login controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logout controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
