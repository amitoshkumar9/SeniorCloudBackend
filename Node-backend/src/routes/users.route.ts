import { Router } from "express";
import { createUserHandler, getUser, listUsers } from "../controllers/users.controller.js";

const router = Router();

router.get("/", listUsers);
router.get("/:id", getUser);
router.post("/", createUserHandler);

export default router;
