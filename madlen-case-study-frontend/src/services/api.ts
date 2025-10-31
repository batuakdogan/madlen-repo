import axios from 'axios';
import type { Model } from '../types';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchModels = async (): Promise<Model[]> => {
  const response = await apiClient.get<{ success: boolean; data: Model[] }>('/models');
  return response.data.data;
};

export const postChatMessage = async (
  message: string,
  sessionId?: string | null,
  model?: string
): Promise<{ success: boolean; data: { reply: string; sessionId: string } }> => {
  const response = await apiClient.post<{ success: boolean; data: { reply: string; sessionId: string } }>(
    '/chat',
    {
      message,
      sessionId: sessionId || undefined,
      model: model || undefined,
    }
  );
  return response.data;
};

export default apiClient;

