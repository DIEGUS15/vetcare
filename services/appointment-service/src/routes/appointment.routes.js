import { Router } from "express";
import {
  createAppointment,
  getVetAppointment,
  getMyAppointments,
} from "../controllers/appointment.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

//Obtener las citas de un propietario en especificio
router.get(
  "/appointment/ownerId",
  authRequired,
  checkRole(["veterinarian", "admin", "recepcionista"], getMyAppointments)
);

//Obtener las citas de un veterinario en especificio
router.get(
  "/appointment/veterinarianId",
  authRequired,
  checkRole(["veterinarian", "admin", "recepcionista"], getVetAppointment)
);

router.post(
  "/appointment",
  authRequired,
  checkRole(["admin"]),
  createAppointment
);

export default router;
