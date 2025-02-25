import { login, logout, signup } from "../controllers/auth.controller.js";
import { Router } from "express";

export const getAuthRoutes = () => {
  const router = Router();

  router.post("/signup", signup);

  router.post("/login", login);

  router.post("/logout", logout);

  return router;
};
