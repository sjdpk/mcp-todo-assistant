import { Router } from "express";
import todoRoute from "./todo.routes.js"
import mcpRoutes from './mcp.routes.js';

const router = Router();
router.use("/todos", todoRoute);
router.use("/mcp", mcpRoutes);
export default router;