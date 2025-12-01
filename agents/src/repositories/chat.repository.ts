import { pool } from "../config/db.js";
import type { ChatMessage } from "../models/chat.models.js";

export const chatRepository = {
  /** Ensure a thread row exists (relies on DEFAULT user_id) */
  async createThread(threadId: string) {
    await pool.query(
      "INSERT INTO chat_threads (id) VALUES ($1) ON CONFLICT (id) DO NOTHING",
      [threadId]
    );
  },

  /** Insert a chat message */
  async createMessage(params: {
    threadId: string;
    sender: "user" | "agent" | "system";
    content: string;
    category?: string | null;
  }) {
    const { threadId, sender, content, category = null } = params;
    await pool.query(
      "INSERT INTO chat_messages (thread_id, sender, category, content) VALUES ($1, $2, $3, $4)",
      [threadId, sender, category, content]
    );
  },

  /** Update thread timestamp and title (if provided) */
  async updateThread(threadId: string, title?: string | null) {
    if (typeof title === "undefined") {
      await pool.query(
        "UPDATE chat_threads SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        [threadId]
      );
    } else {
      await pool.query(
        "UPDATE chat_threads SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [title || null, threadId]
      );
    }
  },

  /** List latest threads with message counts */
  async findAllThreads(limit = 50) {
    const result = await pool.query(
      `
      SELECT 
        t.id AS thread_id,
        t.title,
        t.updated_at AS last_updated,
        COUNT(m.id) AS message_count
      FROM chat_threads t
      LEFT JOIN chat_messages m ON m.thread_id = t.id
      WHERE t.is_deleted = FALSE
      GROUP BY t.id, t.title, t.updated_at
      ORDER BY t.updated_at DESC
      LIMIT $1
      `,
      [limit]
    );

    return result.rows.map((row) => ({
      threadId: row.thread_id as string,
      title: row.title as string | null,
      timestamp: row.last_updated as Date,
      messageCount: parseInt(row.message_count, 10),
    }));
  },

  /** Get a specific thread by ID */
  async findThreadById(threadId: string) {
    const result = await pool.query(
      "SELECT * FROM chat_threads WHERE id = $1 AND is_deleted = FALSE",
      [threadId]
    );
    return result.rows[0] || null;
  },

  /** Get all messages for a thread */
  async findMessageByThreadid(threadId: string) {
    const result = await pool.query(
      `
      SELECT sender, content, category, created_at
      FROM chat_messages
      WHERE thread_id = $1 AND is_deleted = FALSE
      ORDER BY created_at ASC
      `,
      [threadId]
    );

    return result.rows as Pick<
      ChatMessage,
      "sender" | "content" | "category" | "createdAt"
    >[];
  },

  /** Hard delete thread (messages removed via ON DELETE CASCADE) */
  async deleteThread(threadId: string) {
    await pool.query("DELETE FROM chat_threads WHERE id = $1", [threadId]);
  },

  /** Delete old threads based on updated_at */
  async cleanupOldThreads(cutoff: Date) {
    const result = await pool.query(
      `
      DELETE FROM chat_threads
      WHERE updated_at < $1
      RETURNING id
      `,
      [cutoff]
    );
    return result.rowCount || 0;
  },
};
