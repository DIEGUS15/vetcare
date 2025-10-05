import { Router } from "express";
import {
  getPets,
  getPet,
  getMyPets,
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

//Obtener una mascota específica por ID
router.get(
  "/pets/:id",
  authRequired,
  checkRole(["veterinarian", "rescepcionista", "admin", "client"]),
  getPet
);

//Obtener las mascotas del usuario logueado
router.get(
  "/my-pets/",
  authRequired,
  checkRole(["client", "veterinarian", "recepcionista", "admin"]),
  getMyPets
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
