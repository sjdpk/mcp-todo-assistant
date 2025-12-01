import { Router } from "express";
import { TodoController } from "../controllers/todo.controller.js";

// Create an Router instance of Express
const router = Router();

// create an instance of controller
const _todoController = new TodoController();

// Route Definations
router
    .get("/", _todoController.findAll)
    .get("/:id", _todoController.findById)
    .post("/", _todoController.create)
    .put("/:id", _todoController.update)
    .delete("/:id", _todoController.delete);

export default router;