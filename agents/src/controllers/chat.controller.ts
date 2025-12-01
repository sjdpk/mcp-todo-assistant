
import type { Request, Response } from "express";
import { chatService } from "../services/chat.service.js";
import { tools } from "../services/agent.service.js";

/**
 * POST /api/chat
 * Streaming chat endpoint (SSE).
 */
export async function postChat(req: Request, res: Response) {
  try {
    const { message, threadId = "default" } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message must be a non-empty string" });
    }

    // Prepare DB state
    await chatService.prepareChat(threadId, message);

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const streamEvents = chatService.streamAgent(message, threadId);

    let assistantMessage = "";

    try {
      for await (const event of streamEvents) {
        // LLM token streaming
        if (event.event === "on_chat_model_stream") {
          const chunk = event.data?.chunk;
          if (!chunk?.content) continue;

          let content = "";

          if (typeof chunk.content === "string") {
            content = chunk.content;
          } else if (Array.isArray(chunk.content)) {
            content = chunk.content
              .map((part: any) =>
                typeof part === "string"
                  ? part
                  : part?.text
                  ? part.text
                  : ""
              )
              .join("");
          }

          if (content) {
            assistantMessage += content;
            res.write(
              `data: ${JSON.stringify({ type: "content", content })}\n\n`
            );
          }
        }

        // Tool lifecycle events
        else if (event.event === "on_tool_start") {
          res.write(
            `data: ${JSON.stringify({
              type: "tool_start",
              tool: event.name,
              input: event.data?.input,
            })}\n\n`
          );
        } else if (event.event === "on_tool_end") {
          const output = event.data?.output;
          const content = output?.content || output;
          res.write(
            `data: ${JSON.stringify({
              type: "tool_end",
              tool: event.name,
              output:
                typeof content === "string" ? content : JSON.stringify(content),
            })}\n\n`
          );
        }

        // Chain step events
        else if (event.event === "on_chain_stream" && event.data?.chunk) {
          const stepName = Object.keys(event.data.chunk)[0];
          res.write(
            `data: ${JSON.stringify({ type: "step", step: stepName })}\n\n`
          );
        }
      }

      // Persist assistant response
      await chatService.saveAssistantMessage(threadId, assistantMessage);

      // Finish stream
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (streamError) {
      console.error("Error in stream processing:", streamError);
      if (!res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            error: "Stream processing error",
          })}\n\n`
        );
        res.end();
      }
    }
  } catch (error) {
    console.error("Error processing chat request:", error);
    if (!res.writableEnded) {
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          error:
            error instanceof Error ? error.message : "Internal server error",
        })}\n\n`
      );
      res.end();
    }
  }
}

/**
 * GET /api/health
 * Lightweight health check.
 */
export async function getHealth(req: Request, res: Response) {
  try {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mcp: {
        connected: true, 
        tools: tools.length,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
