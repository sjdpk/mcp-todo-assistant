import { Router } from "express";
import { McpController } from "../controllers/mcp.controller.js";

const router = Router();
const mcpController = new McpController();

// Handle all MCP requests (GET for SSE, POST for messages)
router.all("/", mcpController.handleMcpRequest);

export default router;