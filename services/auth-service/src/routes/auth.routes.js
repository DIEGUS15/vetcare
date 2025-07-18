import { Router } from "express";
import {
  login,
  logout,
  verifyToken,
  refreshToken, // Nueva función
  profile,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyToken);
router.post("/refresh-token", refreshToken); // Nueva ruta

router.get("/profile", authRequired, profile);
router.put("/profile", authRequired, updateProfile);

export default router;
