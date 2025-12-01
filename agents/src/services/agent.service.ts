// LangGraph agent + MCP + LLM wiring

import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { config } from "../config/env.js";

// MCP client to talk to your backend tools.
export const mcpClient = new MultiServerMCPClient({
  mcpServers: {
    todo: {
      url: config.mcpUrl,
      transport: "http",
      reconnect: {
        enabled: true,
        maxAttempts: 3,
        delayMs: 1000,
      },
    },
  },
  prefixToolNameWithServerName: true,
  additionalToolNamePrefix: "mcp",
});

// Load tools once at startup
export const tools = await mcpClient.getTools();

// Gemini 2.5 Flash model with streaming enabled.
export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.googleApiKey,
  temperature: 0.7,
  streaming: true,
});

// LangGraph agent with in-memory checkpointing.
const checkpointer = new MemorySaver();

export const agent: any = createAgent({
  model: llm,
  tools,
  systemPrompt: `You are a helpful and efficient AI assistant for managing todo tasks.

- Create, read, update, and delete todo items
- Help users organise and prioritise tasks
- Remember context across messages
- Keep responses concise and clear`,
  checkpointer,
});

//  Close MCP on shutdown 
export async function closeAgent() {
  await mcpClient.close();
}
