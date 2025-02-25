import { Response } from "express";
import { GetUserAuthInfoRequestI } from "../middlewares/authVerification.js";
import User from "../models/user.model.js";
import { RequestWithParams } from "../types/ReqResTypes.js";

// Get all users except logged user
export const getUsers = async (req: GetUserAuthInfoRequestI, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const loggedUserId = req.user._id;

    // Get all users except logged user
    const users = await User.find({ _id: { $ne: loggedUserId } }).select(
      "-password"
    );
    if (!users) {
      return res.status(200).json([]);
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in get users controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

type GetUserByIdRequestI = RequestWithParams<{ id: string }> &
  GetUserAuthInfoRequestI;
// Get user by id
export const getUserById = async (req: GetUserByIdRequestI, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in get user by id controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
