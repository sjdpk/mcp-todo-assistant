import axios, { type AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.get<T>(`${this.baseURL}${endpoint}`, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.post<T>(`${this.baseURL}${endpoint}`, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.put<T>(`${this.baseURL}${endpoint}`, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.delete<T>(`${this.baseURL}${endpoint}`, config);
    return response.data;
  }
}

export const apiService = new ApiService();
