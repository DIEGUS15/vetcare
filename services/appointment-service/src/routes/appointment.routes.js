import { Router } from "express";
import { createAppointment } from "../controllers/appointment.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post(
  "/appointment",
  authRequired,
  checkRole(["admin"]),
  createAppointment
);

export default router;
