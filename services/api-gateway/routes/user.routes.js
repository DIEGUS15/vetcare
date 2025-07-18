import { Router } from "express";
import {
  registerController,
  getUsersController,
  updateUser,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  authenticate,
  authorize(["admin"]),
  registerController
);

router.get("/users", authenticate, authorize(["admin"]), getUsersController);

router.put("/users/:id", authenticate, authorize(["admin"]), updateUser);

export default router;
