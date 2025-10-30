import axios from 'axios';
import { chatSessions, ChatMessage } from './chat.store.js';

export async function getOpenRouterReply(userMessage: string, sessionId: string, modelId?: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelToUse = modelId || process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
  }

  let history = chatSessions.get(sessionId);
  if (!history) {
    history = [];
    chatSessions.set(sessionId, history);
  }

  const messages: ChatMessage[] = [
    ...history,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: modelToUse,
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('No response content received from OpenRouter');
    }

    // Save both user message and assistant reply to history
    history.push({ role: 'user', content: userMessage });
    history.push({ role: 'assistant', content: aiMessage });

    return aiMessage;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      throw new Error(`OpenRouter API error: ${errorMessage}`);
    }
    throw error;
  }
}

