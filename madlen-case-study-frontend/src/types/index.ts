export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Model {
  id: string;
  name: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

