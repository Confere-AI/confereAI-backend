import express from "express";
import {
  signUpvalidateMiddleware,
  signInvalidateMiddleware,
} from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  signUpNormal,
  signInNormal,
  refreshToken,
  logoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signUpvalidateMiddleware, signUpNormal);
router.post("/sign-in", signInvalidateMiddleware, signInNormal);
router.post("/logout", authMiddleware, logoutController);
router.post("/refresh", refreshToken);

export default router;