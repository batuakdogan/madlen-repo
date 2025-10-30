import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getOpenRouterReply } from '../services/chat.service.js';
import { chatSessions } from '../services/chat.store.js';

export async function handleChatMessage(req: Request, res: Response): Promise<void> {
  try {
    const { message, model, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
      return;
    }

    // Generate a new sessionId if not provided
    const currentSessionId = sessionId || uuidv4();

    const aiResponse = await getOpenRouterReply(message, currentSessionId, model);

    res.status(200).json({
      success: true,
      data: {
        reply: aiResponse,
        sessionId: currentSessionId
      }
    });
  } catch (error) {
    console.error('Error in handleChatMessage:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

export function getChatHistory(req: Request, res: Response): void {
  try {
    const { sessionId } = req.params;

    const history = chatSessions.get(sessionId) || [];

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        history
      }
    });
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

