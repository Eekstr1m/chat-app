import { Router } from "express";
import authVerification from "../middlewares/authVerification.js";
import { getUserById, getUsers } from "../controllers/users.controller.js";

export const getUsersRoutes = () => {
  const router = Router();

  router.get("/", authVerification, getUsers);
  router.get("/:id", authVerification, getUserById);

  return router;
};
