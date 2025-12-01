import { pool } from '../config/db.js';
import { Todo } from '../models/todo.models.js';

export class TodoRepository {

    // Find all todos from the db for a user
    // @param userId - ID of the user
    async findAll(userId: string): Promise<Todo[]> {
        const res = await pool.query(
            `SELECT * FROM todos 
             WHERE user_id = $1 
             AND is_deleted = FALSE
             ORDER BY created_at 
             DESC`,
            [userId]
        );
        return res.rows;
    }

    // Find single todo by Id
    // @param id - ID of the todo
    async findById(id: string): Promise<Todo | null> {
        const res = await pool.query(
            `SELECT * FROM todos 
             WHERE id = $1
             AND is_deleted = FALSE`,
            [id]
        );
        return res.rows[0] || null;
    }

    // Create a new todo
    // @param todo - Todo object to be created
    async create(todo: Partial<Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>>): Promise<Todo> {
        const res = await pool.query(
            `INSERT INTO todos (text, is_completed, priority, user_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [todo.text, todo.is_completed, todo.priority, todo.user_id]
        );
        return res.rows[0];
    }

    // Update an existing todo
    // @param id - ID of the todo to be updated
    // @param todo - Updated todo object
    async update(id: string, todo: Partial<Todo>): Promise<Todo | null> {
        const res = await pool.query(
            `UPDATE todos SET 
                text = COALESCE($1, text), 
                is_completed = COALESCE($2, is_completed), 
                priority = COALESCE($3, priority), 
                user_id = COALESCE($4, user_id),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5 
            AND is_deleted = FALSE 
            RETURNING *`,
            [todo.text, todo.is_completed, todo.priority,todo.user_id, id]
        );
        return res.rows[0] || null;
    }

    // Delete(soft) a todo by Id
    // @param id - ID of the todo to be deleted
    async delete(id: string): Promise<boolean> {
        const res = await pool.query(
            `UPDATE todos 
             SET is_deleted = TRUE,
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [id]
        );
        return (res.rowCount ?? 0) > 0;
    }

}