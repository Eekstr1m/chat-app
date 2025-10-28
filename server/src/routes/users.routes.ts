import { Router } from "express";
import authVerification from "../middlewares/authVerification.js";
import {
  getFollowedUsers,
  getSearchUsers,
  getUserById,
  getUsers,
  setFollowStatus,
  updateAuthUserAvatar,
} from "../controllers/users.controller.js";
import { avatarUpload } from "../middlewares/avatarUpload.js";

export const getUsersRoutes = () => {
  const router = Router();

  router.get("/", authVerification, getUsers);
  router.put("/follow/:id", authVerification, setFollowStatus);
  router.get("/followed", authVerification, getFollowedUsers);
  router.get("/user/:id", authVerification, getUserById);
  router.get("/search", authVerification, getSearchUsers);
  router.put(
    "/avatar",
    authVerification,
    avatarUpload.single("avatar"),
    updateAuthUserAvatar
  );

  return router;
};
