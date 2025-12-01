export interface Todo{
    id: string;
    text: string;
    is_completed: boolean;
    priority: number;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}