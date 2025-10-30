export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatSessions = new Map<string, ChatMessage[]>();

