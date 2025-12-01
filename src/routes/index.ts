// src/routes/index.ts
// Attach all route groups to the app

import type { Express } from "express";
import chatRoutes from "./chat.routes.js";
import threadRoutes from "./thread.routes.js";

export function registerRoutes(app: Express) {
  app.use("/api", chatRoutes);
  app.use("/api", threadRoutes);
}
