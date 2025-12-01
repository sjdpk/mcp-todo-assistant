// src/services/chat.service.ts
// Business logic combining repository + agent

import { agent } from "./agent.service.js";
import { chatRepository } from "../repositories/chat.repository.js";

export const chatService = {
  // Prepare thread and persist the incoming user message.
  async prepareChat(threadId: string, message: string) {
    await chatRepository.createThread(threadId);
    await chatRepository.createMessage({
      threadId,
      sender: "user",
      content: message,
    });
    await chatRepository.updateThread(threadId);
  },

  // Stream LangGraph events for the given message / thread.
  streamAgent(message: string, threadId: string) {
    const config = {
      configurable: { thread_id: threadId },
    };

    return agent.streamEvents(
      { messages: [{ role: "user", content: message }] },
      { ...config, version: "v2" }
    );
  },

  // Persist the final assistant response.
  async saveAssistantMessage(threadId: string, assistantMessage: string) {
    if (!assistantMessage.trim()) return;

    await chatRepository.createMessage({
      threadId,
      sender: "agent",
      content: assistantMessage,
    });

    await chatRepository.updateThread(threadId);
  },
};
