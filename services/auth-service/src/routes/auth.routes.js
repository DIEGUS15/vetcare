import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyToken,
  profile,
  getUsers,
  updateUser,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyToken);
router.get("/profile", authRequired, profile);

router.post("/register", register);
router.get("/users", authRequired, checkRole(["admin"]), getUsers);
router.put("/user/:id", authRequired, checkRole(["admin"]), updateUser);

export default router;
