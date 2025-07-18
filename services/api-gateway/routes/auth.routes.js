import { Router } from "express";
import {
  loginController,
  logoutController,
  verifyController,
  refreshTokenController,
  getProfileController,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/verify", authenticate, verifyController);
router.post("/refresh-token", refreshTokenController);

router.get("/profile", authenticate, getProfileController);
router.put("/profile", authenticate, updateProfile);

export default router;
