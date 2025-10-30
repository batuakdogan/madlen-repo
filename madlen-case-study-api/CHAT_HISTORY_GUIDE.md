# Chat History & Session Management Guide

This guide explains how to use the chat history and session management features in the Madlen Case Study API.

## Overview

The API now supports:
- ✅ **Session-based conversations** - Continue multi-turn conversations
- ✅ **Automatic session creation** - New sessions generated automatically
- ✅ **Chat history storage** - All messages stored in-memory per session
- ✅ **History retrieval** - Get complete conversation history by session ID
- ✅ **Context-aware responses** - AI remembers previous messages in the conversation

## How It Works

### Session Management

1. **First Message (New Session)**
   - Send a message without a `sessionId`
   - Server generates a unique session ID (UUID)
   - Returns AI response + `sessionId`

2. **Follow-up Messages (Continue Session)**
   - Send subsequent messages with the same `sessionId`
   - AI has full context of previous conversation
   - Returns AI response + same `sessionId`

3. **History Retrieval**
   - Request history using the `sessionId`
   - Get complete conversation with all user/assistant messages

## API Endpoints

### 1. Send Chat Message (POST /api/v1/chat)

**Start a new conversation:**
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello! What is AI?"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "AI stands for Artificial Intelligence...",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Continue the conversation:**
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you give me an example?",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Sure! A common example of AI is...",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 2. Get Chat History (GET /api/v1/chat/history/:sessionId)

**Retrieve conversation history:**
```bash
curl http://localhost:8000/api/v1/chat/history/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "history": [
      {
        "role": "user",
        "content": "Hello! What is AI?"
      },
      {
        "role": "assistant",
        "content": "AI stands for Artificial Intelligence..."
      },
      {
        "role": "user",
        "content": "Can you give me an example?"
      },
      {
        "role": "assistant",
        "content": "Sure! A common example of AI is..."
      }
    ]
  }
}
```

## Request Parameters

### POST /api/v1/chat

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The message to send to the AI |
| `sessionId` | string | No | Session ID to continue a conversation. If not provided, a new session is created. |
| `model` | string | No | AI model to use (e.g., `google/gemma-2-9b-it:free`) |

### GET /api/v1/chat/history/:sessionId

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string (path) | Yes | The session ID to retrieve history for |

## Frontend Integration Examples

### JavaScript/TypeScript Example

```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  success: boolean;
  data: {
    reply: string;
    sessionId: string;
  };
}

interface HistoryResponse {
  success: boolean;
  data: {
    sessionId: string;
    history: ChatMessage[];
  };
}

class ChatService {
  private baseURL = 'http://localhost:8000/api/v1';
  private currentSessionId: string | null = null;

  // Send a message in the current session
  async sendMessage(message: string, model?: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId: this.currentSessionId,
        model
      })
    });

    const data: ChatResponse = await response.json();
    
    // Store sessionId for future messages
    this.currentSessionId = data.data.sessionId;
    
    return data.data.reply;
  }

  // Start a new conversation
  startNewConversation() {
    this.currentSessionId = null;
  }

  // Get current session history
  async getHistory(): Promise<ChatMessage[]> {
    if (!this.currentSessionId) {
      return [];
    }

    const response = await fetch(
      `${this.baseURL}/chat/history/${this.currentSessionId}`
    );
    
    const data: HistoryResponse = await response.json();
    return data.data.history;
  }

  // Get session ID
  getSessionId(): string | null {
    return this.currentSessionId;
  }
}

// Usage
const chat = new ChatService();

// Start conversation
const reply1 = await chat.sendMessage("Hello!");
console.log("AI:", reply1);

// Continue conversation
const reply2 = await chat.sendMessage("Tell me more");
console.log("AI:", reply2);

// Get history
const history = await chat.getHistory();
console.log("Conversation history:", history);

// Start new conversation
chat.startNewConversation();
const newReply = await chat.sendMessage("New topic!");
```

### React Example

```tsx
import { useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load history when sessionId changes
  useEffect(() => {
    if (sessionId) {
      loadHistory();
    }
  }, [sessionId]);

  const loadHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/history/${sessionId}`
      );
      const data = await response.json();
      setMessages(data.data.history);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    // Add user message optimistically
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId
        })
      });

      const data = await response.json();
      
      // Update sessionId if new
      if (!sessionId) {
        setSessionId(data.data.sessionId);
      }

      // Add assistant message
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.data.reply }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Chat</h2>
        <button onClick={startNewChat}>New Conversation</button>
      </div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <div className="loading">AI is typing...</div>}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>

      {sessionId && (
        <div className="session-info">
          Session ID: {sessionId}
        </div>
      )}
    </div>
  );
}
```

## Testing with Swagger UI

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI:**
   ```
   http://localhost:8000/api-docs
   ```

3. **Test the Chat Flow:**
   
   **Step 1: Send first message**
   - Find `POST /api/v1/chat`
   - Click "Try it out"
   - Enter:
     ```json
     {
       "message": "Hello! What's your name?"
     }
     ```
   - Click "Execute"
   - **Copy the `sessionId` from the response**

   **Step 2: Continue conversation**
   - Use the same `POST /api/v1/chat` endpoint
   - Enter:
     ```json
     {
       "message": "What can you help me with?",
       "sessionId": "paste-the-session-id-here"
     }
     ```
   - Click "Execute"
   - Notice the AI remembers the context!

   **Step 3: View history**
   - Find `GET /api/v1/chat/history/{sessionId}`
   - Click "Try it out"
   - Paste your `sessionId`
   - Click "Execute"
   - See the complete conversation!

## Storage Notes

⚠️ **Important:** The current implementation uses **in-memory storage**:

- ✅ **Pros:** Fast, simple, no database needed
- ⚠️ **Cons:** 
  - All sessions are lost when the server restarts
  - Not suitable for production at scale
  - No persistence across server instances

### For Production:
Consider implementing persistent storage with:
- **Database:** PostgreSQL, MongoDB
- **Cache:** Redis for fast session access
- **Combination:** Database for persistence + Redis for active sessions

## Best Practices

1. **Always store the sessionId** on the frontend to continue conversations
2. **Handle session expiry** gracefully (implement TTL in production)
3. **Clear old sessions** periodically to prevent memory leaks
4. **Validate sessionId format** (UUID) before API calls
5. **Implement session limits** (max messages per session, max sessions per user)

## Use Cases

- 📝 **Multi-turn conversations** - Ask follow-up questions
- 🧠 **Context awareness** - AI remembers what was discussed
- 📊 **Conversation analysis** - Review chat history
- 💾 **Resume conversations** - Continue where you left off
- 🔄 **Multiple conversations** - Manage separate topics with different sessions

## Troubleshooting

**Issue:** AI doesn't remember previous messages
- **Solution:** Make sure you're passing the same `sessionId` in each request

**Issue:** History returns empty array
- **Solution:** Verify the `sessionId` is correct and the session exists

**Issue:** Session not found
- **Solution:** The server may have restarted (in-memory storage cleared)

**Issue:** Getting different responses in same session
- **Solution:** You might be using different models - check the `model` parameter

