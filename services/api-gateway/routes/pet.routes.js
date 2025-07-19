import { Router } from "express";
import {
  getPetsController,
  createPetController,
  getPetsByUserController,
  updatePet,
} from "../controllers/pet.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/pets",
  authenticate,
  authorize(["veterinarian", "recepcionista", "admin"]),
  getPetsController
);

router.get("/pets/user/:userId", authenticate, getPetsByUserController);

router.post(
  "/pet",
  authenticate,
  authorize(["veterinarian", "recepcionista", "admin"]),
  createPetController
);

router.put("/pet/:id", authenticate, authorize(["admin"]), updatePet);

export default router;
