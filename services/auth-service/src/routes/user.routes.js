import { Router } from "express";
import {
  registerUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post("/register", authRequired, checkRole(["admin"]), registerUser);
router.get("/users", authRequired, checkRole(["admin"]), getUsers);
router.put("/users/:id", authRequired, checkRole(["admin"]), updateUser);

export default router;
