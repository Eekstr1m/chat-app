import { Response } from "express";
import { GetUserAuthInfoRequestI } from "../middlewares/authVerification.js";
import User from "../models/user.model.js";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from "../types/ReqResTypes.js";
import Conversation from "../models/conversation.model.js";
import { uploadProfilePicture } from "../utils/uploadToR2.js";
import { isValidObjectId } from "mongoose";
import { randomUUID } from "crypto";

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

// Get followed participant for logged user
export const getFollowedUsers = async (
  req: GetUserAuthInfoRequestI,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const loggedUserId = req.user._id;

    const loggedUser = await User.findOne({
      _id: loggedUserId,
    }).select("followedParticipants");

    if (!loggedUser)
      return res.status(400).json({ error: "Something went wrong" });
    const followedParticipants = loggedUser.followedParticipants;

    // Get all followed users
    // const users = await User.find({
    //   _id: { $in: followedParticipants },
    // })
    //   // .sort({ updatedAt: 1 })
    //   .select("-password");

    // Alternative way to get followed users by conversations
    // Find all conversations that include the logged user as a participant
    const conversationUsers = await Conversation.find({
      participants: { $in: [loggedUserId] },
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "-password");

    // Filter out the logged user from the participants list
    const users = conversationUsers
      .map((c) => c.participants)
      .flat()
      .filter((u) => u._id.toString() !== loggedUserId.toString());

    if (!users) {
      return res.status(200).json([]);
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in get followed users controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

type SetFollowUserRequestI = RequestWithParams<{ id: string }> &
  GetUserAuthInfoRequestI;

// Set follow status to selected id for logged user
export const setFollowStatus = async (
  req: SetFollowUserRequestI,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!req.user || !id) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const loggedUserId = req.user._id;

    let participantId;
    if (isValidObjectId(id)) {
      participantId = id;
    } else {
      const user = await User.findOne({ userName: id }).select("_id");

      if (!user) return res.status(400).json({ error: "User not found" });

      participantId = user._id;
    }

    const loggedUser = await User.findOneAndUpdate(
      { _id: loggedUserId },
      { $addToSet: { followedParticipants: participantId } },
      { new: true }
    ).select("-password");

    if (!loggedUser)
      return res.status(400).json({ error: "Something went wrong" });

    return res.status(200).json(loggedUser);
  } catch (error) {
    console.error("Error in set follow status controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

type GetSearchUserRequestI = RequestWithQuery<{ searchTerm: string }> &
  GetUserAuthInfoRequestI;

// Search users except logged user by searchTerm using mongo regex
export const getSearchUsers = async (
  req: GetSearchUserRequestI,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const loggedUserId = req.user._id;

    const { searchTerm } = req.query;
    if (!searchTerm) return res.status(200);

    const users = await User.find({
      _id: { $ne: loggedUserId },
      $or: [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { userName: { $regex: searchTerm, $options: "i" } },
      ],
    });

    if (users.length <= 0) {
      return res.status(404).json({ error: "Users not found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in get search users controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

type GetUserByIdRequestI = RequestWithParams<{ id: string }> &
  GetUserAuthInfoRequestI;

// Get user by id or userName
export const getUserById = async (req: GetUserByIdRequestI, res: Response) => {
  try {
    const { id } = req.params;

    let user;
    if (isValidObjectId(id)) {
      user = await User.findById(id).select("-password");
    } else {
      user = await User.findOne({ userName: id }).select("-password");
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in get user by id controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

type UpdateUserRequestI = RequestWithBody<{ avatar: string }> &
  GetUserAuthInfoRequestI;

// Update auth user avatar
export const updateAuthUserAvatar = async (
  req: GetUserAuthInfoRequestI,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    const loggedUserId = req.user._id;

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = loggedUserId + "-" + randomUUID();

    const avatarUrl = await uploadProfilePicture(
      file.buffer,
      fileName,
      file.mimetype,
      loggedUserId.toString()
    );

    const user = await User.findByIdAndUpdate(
      loggedUserId,
      {
        $set: {
          avatar: avatarUrl,
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in update auth user avatar controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
