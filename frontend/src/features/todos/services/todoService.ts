import { apiService } from '../../../config/api';
import type { Todo } from '../../../types';
const USER_ID = '00000000-0000-0000-0000-000000000000';
class TodoService {
  private endpoint = '/todos';
  
  // UserId
  private getUserId() {
    return {
      headers: {
        "user_id": USER_ID
      }
    }
  }

  async getAll(): Promise<Todo[]> {
    const response = await apiService.get<{ success: boolean; data: Todo[] }>(this.endpoint, this.getUserId());
    return response.data;
  }

  async create(text: string): Promise<Todo> {
    const response = await apiService.post<{ success: boolean; data: Todo }>(this.endpoint, { text }, this.getUserId());
    return response.data;
  }

  async update(id: string, is_completed: boolean): Promise<Todo> {
    const response = await apiService.put<{ success: boolean; data: Todo }>(`${this.endpoint}/${id}`, { is_completed }, this.getUserId());
    return response.data;
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/${id}`, this.getUserId());
  }
}

export const todoService = new TodoService();
