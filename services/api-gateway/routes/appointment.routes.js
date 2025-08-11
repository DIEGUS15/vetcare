import { Router } from "express";
import { createAppointment } from "../controllers/appointment.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/appointment",
  authenticate,
  authorize(["admin"]),
  createAppointment
);

export default router;
