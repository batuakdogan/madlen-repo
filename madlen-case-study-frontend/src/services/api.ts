import axios from 'axios';
import type { Model } from '../types';
import { extractErrorMessage } from '../utils/errorHandler';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', extractErrorMessage(error));
    return Promise.reject(error);
  }
);

export const fetchModels = async (): Promise<Model[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: Model[] }>('/models');
    return response.data.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const postChatMessage = async (
  message: string,
  sessionId?: string | null,
  model?: string
): Promise<{ success: boolean; data: { reply: string; sessionId: string } }> => {
  try {
    const response = await apiClient.post<{ success: boolean; data: { reply: string; sessionId: string } }>(
      '/chat',
      {
        message,
        sessionId: sessionId || undefined,
        model: model || undefined,
      }
    );
    return response.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export const fetchChatHistory = async (sessionId: string): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> => {
  try {
    const response = await apiClient.get<Array<{ role: 'user' | 'assistant'; content: string }>>(
      `/chat/history/${sessionId}`
    );
    return response.data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

export default apiClient;

