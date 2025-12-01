import { Todo } from "../models/todo.models.js";
import { TodoRepository } from "../repositories/todo.repository.js";
import { AppError } from '../utils/response.js';

//TodoService
// 
// This class handles the BUSINESS LOGIC.
// It sits between the Controller (HTTP) and the Repository (Database).
// 
// Responsibilities:
// 1. Validate input data (e.g., check if text is empty).
// 2. Call the Repository to interact with the DB.
// 3. Return processed data to the Controller.
export class TodoService {
    private _todoRepository: TodoRepository;
    constructor() {
        this._todoRepository = new TodoRepository();
    }

    // Fetch all todos for a user
    async findAll(userId: string): Promise<Todo[]> {
        return this._todoRepository.findAll(userId);
    }

    // Get todo by ID
    async findById(id: string): Promise<Todo | null> {
        return this._todoRepository.findById(id);
    }

    // Create a new todo
    async create(todo: Partial<Todo>): Promise<Todo> {
        if (!todo.text || todo.text.trim() === "") {
            throw new AppError("Todo text cannot be empty");
        }
        return this._todoRepository.create(todo);
    }

    // Update an existing todo
    // Logic here, e.g., "You can't un-complete a todo after 30 days"
    async update(id: string, todoData: Partial<Todo>): Promise<Todo | null> {
        const todo = await this._todoRepository.findById(id);
        if (!todo) {
            throw new AppError("Todo not found", 404);
        }
        if (todo.user_id !== todoData.user_id) {
            throw new AppError("Unauthorized update attempt", 401);
        }
        return this._todoRepository.update(id, todoData);
    }

    // Delete a todo
    async delete(id: string, userId: string): Promise<boolean> {
        const todo = await this._todoRepository.findById(id);
        if (!todo) {
            throw new AppError("Todo not found", 404);
        }
        if (todo.user_id !== userId) {
            throw new AppError("Unauthorized update attempt", 401);
        }
        return this._todoRepository.delete(id);
    }
}
