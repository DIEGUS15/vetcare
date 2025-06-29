import { Router } from "express";
import { createPet } from "../controllers/pet.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post(
  "/pet",
  authRequired,
  checkRole(["veterinarian", "recepcionista", "admin"]),
  createPet
);

export default router;
