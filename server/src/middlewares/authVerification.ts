import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { MyToken } from "../utils/generateToken.js";
import { NextFunction, Request, Response } from "express";
import { UserResponseI } from "../interfaces/UserInterfaces.js";

const authVerification = async (
  req: GetUserAuthInfoRequestI,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET) as MyToken;
    if (!verified) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(verified.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    // req.user = user
    next();
  } catch (error) {
    console.error("Error in auth verification middleware", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export default authVerification;

export interface GetUserAuthInfoRequestI extends Request {
  user?: UserResponseI;
}
