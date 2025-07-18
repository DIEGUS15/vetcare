import { Router } from "express";
import {
  createPet,
  getPets,
  getPetsByUser,
} from "../controllers/pet.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.get(
  "/pets",
  authRequired,
  checkRole(["veterinarian", "recepcionista", "admin"]),
  getPets
);

router.post(
  "/pet",
  authRequired,
  checkRole(["veterinarian", "recepcionista", "admin"]),
  createPet
);

router.get(
  "/pets/user/:userId",
  authRequired,
  checkRole(["veterinarian", "recepcionista", "admin"]),
  getPetsByUser
);

export default router;
