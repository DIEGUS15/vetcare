import { Router } from "express";
import {
  getPets,
  getPetsByUser,
  createPet,
  updatePet,
} from "../controllers/pet.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

//Obtener todas las mascotas
router.get(
  "/pets",
  authRequired,
  checkRole(["veterinarian", "recepcionista", "admin"]),
  getPets
);

//Obtener las mascotas que pertenecen a un usuario específico
router.get(
  "/pets/user/:userId",
  authRequired,
  checkRole(["veterinarian", "recepcionista", "admin"]),
  getPetsByUser
);

//Crear mascotas
router.post(
  "/pet",
  authRequired,
  checkRole(["veterinarian", "recepcionista", "admin"]),
  createPet
);

//Editar mascotas
router.put("/pet/:id", authRequired, checkRole(["admin"]), updatePet);

export default router;
