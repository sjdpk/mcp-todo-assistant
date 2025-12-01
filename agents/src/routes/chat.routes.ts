// src/routes/chat.routes.ts
// Routes for chat + health

import { Router } from "express";
import { postChat, getHealth } from "../controllers/chat.controller.js";

const router = Router();

router.post("/chat", postChat);
router.get("/health", getHealth);

export default router;
