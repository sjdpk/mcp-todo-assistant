// src/controllers/thread.controller.ts
// Handlers for thread & message management

import type { Request, Response } from "express";
import { chatRepository } from "../repositories/chat.repository.js";
import { config } from "../config/env.js";

/**
 * GET /api/threads
 * List recent conversation threads.
 */
export async function findAllThreads(req: Request, res: Response) {
  try {
    const threads = await chatRepository.findAllThreads();
    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
}

/**
 * GET /api/threads/:threadId/messages
 * Full history for a specific thread.
 */
export async function findMessageByThreadid(req: Request, res: Response) {
  try {
    const { threadId } = req.params;
    const rows = await chatRepository.findMessageByThreadid(threadId||'');

    const messages = rows.map((row) => ({
      role: row.sender === "user" ? "user" : "bot",
      text: row.content,
      category: row.category,
      createdAt: row.createdAt,
    }));

    res.json(messages);
  } catch (error) {
    console.error("Error fetching thread messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

/**
 * DELETE /api/threads/:threadId
 * Hard delete a thread (messages removed via cascade).
 */
export async function deleteThread(req: Request, res: Response) {
  try {
    const { threadId } = req.params;
    await chatRepository.deleteThread(threadId||'');
    res.json({ success: true, message: "Thread deleted" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Failed to delete thread" });
  }
}

/**
 * PUT /api/threads/:threadId/title
 * Update title for a thread.
 */
export async function updateThread(req: Request, res: Response) {
  try {
    const { threadId } = req.params;
    const { title } = req.body;
    await chatRepository.updateThread(threadId||'', title || null);
    res.json({ success: true, message: "Title updated" });
  } catch (error) {
    console.error("Error updating thread title:", error);
    res.status(500).json({ error: "Failed to update title" });
  }
}

/**
 * POST /api/cleanup
 * Delete old threads older than retentionDays.
 */
export async function postCleanup(req: Request, res: Response) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);

    const deletedThreads = await chatRepository.cleanupOldThreads(cutoffDate);

    res.json({
      success: true,
      deletedThreads,
      retentionDays: config.retentionDays,
    });
  } catch (error) {
    console.error("Error during cleanup:", error);
    res.status(500).json({ error: "Cleanup failed" });
  }
}
