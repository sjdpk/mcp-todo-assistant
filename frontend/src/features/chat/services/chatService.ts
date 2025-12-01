import { ApiService } from '../../../config/api';
import { API_CONFIG, ENDPOINTS } from '../../../config/constants';

class ChatService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService(API_CONFIG.CHAT_BASE_URL);
  }

  async getThreads() {
    return this.api.get<any[]>(ENDPOINTS.THREADS);
  }

  async getThreadMessages(threadId: string) {
    return this.api.get<any[]>(`${ENDPOINTS.THREADS}/${threadId}/messages`);
  }

  async deleteThread(threadId: string) {
    return this.api.delete(`${ENDPOINTS.THREADS}/${threadId}`);
  }

  async updateThreadTitle(threadId: string, title: string) {
    return this.api.put(`${ENDPOINTS.THREADS}/${threadId}/title`, { title });
  }

  // For streaming, we'll use fetch directly but wrap it here to keep endpoints consistent
  async sendChatMessage(message: string, threadId: string) {
    return fetch(`${API_CONFIG.CHAT_BASE_URL}${ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        threadId,
      }),
    });
  }
}

export const chatService = new ChatService();
