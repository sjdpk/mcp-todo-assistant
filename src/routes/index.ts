import { Router } from "express";
import todoRoute from "./todo.routes.js"

const router = Router();
router.use("/todos", todoRoute);
export default router;