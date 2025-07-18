import { Router } from "express";
import {
  getPetsController,
  createPetController,
  getPetsByUserController,
} from "../controllers/pet.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/pets",
  authenticate,
  authorize(["veterinarian", "recepcionista", "admin"]),
  getPetsController
);

router.post(
  "/pet",
  authenticate,
  authorize(["veterinarian", "recepcionista", "admin"]),
  createPetController
);

router.get("/pets/user/:userId", authenticate, getPetsByUserController);

export default router;
