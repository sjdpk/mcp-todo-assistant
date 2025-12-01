import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { registerRoutes } from "./routes/index.js";
import { closeAgent, mcpClient, llm, tools } from "./services/agent.service.js";
import { closeDbPool } from "./config/db.js";

const app = express();

app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);

app.use(express.json());

// REST routes
registerRoutes(app);

const server = app.listen(config.port, () => {
  console.log("=".repeat(60));
  console.log("AI Agent API Server");
  console.log("=".repeat(60));
  console.log(`Server:  http://localhost:${config.port}`);
  console.log(`Health:  http://localhost:${config.port}/api/health`);
  console.log(`Chat:    http://localhost:${config.port}/api/chat`);
  console.log(`Tools:   ${tools.length} MCP tools loaded`);
  console.log(`Model:   ${llm.model}`);
  console.log("=".repeat(60));
});

/**
 * Graceful shutdown: stop HTTP, MCP and DB.
 */
async function shutdown(code: number) {
  console.log("\nGraceful shutdown starting...");

  server.close(async () => {
    console.log("HTTP server closed");

    try {
      await closeAgent();
      console.log("MCP client closed");
    } catch (err) {
      console.error("Error closing MCP client:", err);
    }

    try {
      await closeDbPool();
      console.log("PostgreSQL pool closed");
    } catch (err) {
      console.error("Error closing PostgreSQL pool:", err);
    }

    console.log("Shutdown complete");
    process.exit(code);
  });

  // Safety timeout
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  shutdown(1);
});
