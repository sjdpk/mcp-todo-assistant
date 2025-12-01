// src/routes/thread.routes.ts
// Routes for threads & messages

import { Router } from "express";
import {
  findAllThreads,
  findMessageByThreadid,
  deleteThread,
  updateThread,
  postCleanup,
} from "../controllers/thread.controller.js";

const router = Router();

router.get("/threads", findAllThreads);
router.get("/threads/:threadId/messages", findMessageByThreadid);
router.delete("/threads/:threadId", deleteThread);
router.put("/threads/:threadId/title", updateThread);
router.post("/cleanup", postCleanup);

export default router;
