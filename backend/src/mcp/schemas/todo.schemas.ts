import * as z from 'zod';
import { id } from 'zod/v4/locales';

// Schema for the Todo manager tool
export enum Action {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete"
}

export const TodoInputSchema = z.object({
    id: z.string().optional().describe('The ID of the Todo item (required for update/delete).'),
    action: z.enum([Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE]).describe('The CRUD action to perform.'),
    text: z.string().optional().describe('The description of the Todo item (required for create/update).'),
    priority: z.number().min(1).max(5).optional().describe('The priority of the Todo item, from 1 (lowest) to 5 (highest).'),
    is_completed: z.boolean().optional().describe('Indicates whether the Todo item is completed.'),
    user_id: z.string().optional().describe('The ID of the user owning the Todo item.'),
})

// Export the inferred TypeScript type
export type TodoInput = z.infer<typeof TodoInputSchema>;