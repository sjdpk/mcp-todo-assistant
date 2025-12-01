import { TodoService } from "../../services/todo.service.js";
import { Action, TodoInputSchema, TodoInput } from "../schemas/todo.schemas.js";
import { AppError } from "../../utils/response.js";

const todoService = new TodoService();
const USER_ID = '00000000-0000-0000-0000-000000000000';

export const todoManagerTool = {
    name: 'todo_manager',
    description: 'A tool to manage Todo items with create, read, update, and delete operations.',
    parameters: TodoInputSchema,
    handler: async (args: TodoInput) => {
        try {
            const { action, ...data } = args || {};
            let result;
            switch (action) {
                case Action.CREATE:
                    if (!data.text) throw new Error('Text is required for creating a Todo item.');
                    const todo = await todoService.create({
                        text: data.text,
                        priority: data.priority ?? 1,
                        user_id: USER_ID
                    });
                    result = { status: 'success', data: todo };
                    break;
                case Action.READ:
                    const todos = await todoService.findAll(USER_ID);
                    result = { status: 'success', count: todos.length, data: todos };
                    break;
                case Action.UPDATE:
                    if (!data.id) throw new AppError("ID is required for update.");

                    // Pass all updateable fields
                    const updatedTodo = await todoService.update(String(data.id), {
                        is_completed: data.is_completed,
                        priority: data.priority,
                        user_id: USER_ID
                    });

                    if (!updatedTodo) throw new AppError(`Todo with ID ${data.id} not found.`);
                    result = { status: 'success', data: updatedTodo };
                    break;
                case Action.DELETE:
                    if (!data.id) throw new AppError("ID is required for delete.");
                    const success = await todoService.delete(String(data.id), USER_ID);
                    if (!success) throw new AppError(`Todo with ID ${data.id} not found.`);
                    result = { status: 'success', message: `Todo ${data.id} deleted` };
                    break;

                default:
                    throw new AppError(`Invalid action: ${action}`);
            }
            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
                isError: false
            };

        } catch (error: Error | any) {
            return {
                content: [{ type: "text" as const, text: `Error: ${error?.message || ''}` }],
                isError: true
            };
        }
    }
}