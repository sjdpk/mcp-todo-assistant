import { Request, Response } from "express";
import { TodoService } from "../services/todo.service.js";
import { Todo } from "../models/todo.models.js";
import { AppError } from '../utils/response.js';

export class TodoController {
    private _todoService: TodoService;
    constructor() {
        this._todoService = new TodoService();
    }

    // GET: /api/todos
    // Retrives all todos for a user
    findAll = async (req: Request, res: Response): Promise<void> => {
        try {
            // Extract userId from request parameters
            const userId = req.headers['user_id'] as string;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized: User ID is missing" });
                return;
            }
            // call service to get todos
            const todos = await this._todoService.findAll(userId);
            res.status(200).json({ success: true, data: todos });
        } catch (error: Error | AppError | any) {
            console.error(error?.message || "issue in findall todo");
            res.status(500).json({ success: false, message: error?.message ?? "Internal Server Error" });
        }
    }

    // GET: /api/todos/:id
    // Get todo by ID
    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const todo = await this._todoService.findById(id);
            if (!todo) {
                res.status(404).json({ success: false, message: "Todo not found" });
                return;
            }
            res.status(200).json({ success: true, data: todo });
        } catch (error: Error | any) {
            console.error(error?.message || "issue in findbyId todo");
            res.status(500).json({ success: false, message: error?.message ?? "Internal Server Error" });
        }
    }

    // POST: /api/todos
    // create a new todo
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.headers['user_id'] as string;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized: User ID is missing" });
                return;
            }
            const todoData: Partial<Todo> = req.body || {};
            todoData.user_id = userId;
            // call the service to create todo
            const createdTodo = await this._todoService.create(todoData);
            res.status(201).json({ success: true, data: createdTodo });
        } catch (error: Error | any) {
            console.error(error?.message || "issue in creating todo");
            res.status(500).json({ success: false, message: error?.message ?? "Internal Server Error" });
        }
    }

    // PUT: /api/todos/:id
    // update an existing todo
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const userId = req.headers['user_id'] as string;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized: User ID is missing" });
                return;
            }
            const todoData: Partial<Todo> = req.body || {};
            todoData.user_id = userId;

            const updatedTodo = await this._todoService.update(id, todoData);
            if (!updatedTodo) {
                res.status(404).json({ success: false, message: "Todo not found" });
                return;
            }
            res.status(200).json({ success: true, data: updatedTodo });
        } catch (error: Error | AppError | any) {
            console.error(error?.message || "issue in updating todo");
            res.status(error.statusCode ?? 500).json({ success: false, message: error?.message ?? "Internal Server Error" });
        }
    }

    // DELETE: /api/todos/:id
    // delete a todo
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const userId = req.headers['user_id'] as string;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized: User ID is missing" });
                return;
            }
            const todo = await this._todoService.delete(id, userId);
            if (!todo) {
                res.status(404).json({ success: false, message: "Todo not found" });
                return;
            }
            res.status(200).json({ success: true, message: "Todo deleted successfully" });
        } catch (error: Error | any) {
            console.error(error?.message || "issue in deleting todo");
            res.status(error.statusCode ?? 500).json({ success: false, message: error?.message ?? "Internal Server Error" });

        }
    }
}