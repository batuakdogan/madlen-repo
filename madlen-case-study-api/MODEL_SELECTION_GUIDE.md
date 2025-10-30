# Model Selection Feature Guide

This guide explains how to use the model selection feature in the Madlen Case Study API.

## Overview

Users can now:
1. **List available AI models** via the `/api/v1/models` endpoint
2. **Choose a specific model** when sending chat messages
3. **Fall back to defaults** if no model is specified

## API Endpoints

### 1. List Available Models

**Endpoint:** `GET /api/v1/models`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "meta-llama/llama-3.2-3b-instruct:free",
      "name": "Llama 3.2 3B (Free)"
    },
    {
      "id": "google/gemma-2-9b-it:free",
      "name": "Gemma 2 9B (Free)"
    },
    {
      "id": "deepseek/deepseek-r1:free",
      "name": "DeepSeek R1 (Free)"
    },
    {
      "id": "x-ai/grok-2-1212",
      "name": "Grok 2 (xAI)"
    }
  ]
}
```

**Usage:**
```bash
curl http://localhost:8000/api/v1/models
```

### 2. Send Chat Message (with optional model selection)

**Endpoint:** `POST /api/v1/chat`

**Request Body:**
```json
{
  "message": "Your message here",
  "model": "mistralai/mistral-7b-instruct:free"  // Optional
}
```

**Example 1: Using Default Model**
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

**Example 2: Specifying a Model**
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me a joke",
    "model": "google/gemma-2-9b-it:free"
  }'
```

## Model Selection Logic

The API determines which model to use with the following priority:

1. **User-selected model** (from request body `model` field)
2. **Environment variable** (`OPENROUTER_MODEL` in `.env`)
3. **Hardcoded default** (`meta-llama/llama-3.2-3b-instruct:free`)

### Code Logic:
```typescript
const modelToUse = modelId || process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';
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

3. **Test the Models Endpoint:**
   - Find `GET /api/v1/models`
   - Click "Try it out"
   - Click "Execute"
   - You'll see the list of available models

4. **Test Chat with Model Selection:**
   - Find `POST /api/v1/chat`
   - Click "Try it out"
   - Enter your request body:
     ```json
     {
       "message": "What's the weather like?",
       "model": "mistralai/mistral-7b-instruct:free"
     }
     ```
   - Click "Execute"
   - Compare responses from different models!

## Frontend Integration Example

### JavaScript/TypeScript Example:

```typescript
// 1. Fetch available models
async function getAvailableModels() {
  const response = await fetch('http://localhost:8000/api/v1/models');
  const data = await response.json();
  return data.data; // Array of models
}

// 2. Send chat message with selected model
async function sendChatMessage(message: string, modelId?: string) {
  const response = await fetch('http://localhost:8000/api/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      model: modelId // Optional
    })
  });
  
  const data = await response.json();
  return data.data.reply;
}

// Usage
const models = await getAvailableModels();
console.log('Available models:', models);

// Send message with specific model
const reply = await sendChatMessage(
  'Hello!', 
  'google/gemma-2-9b-it:free'
);
console.log('AI Reply:', reply);

// Send message with default model
const defaultReply = await sendChatMessage('Hi there!');
console.log('AI Reply (default model):', defaultReply);
```

### React Example:

```tsx
import { useState, useEffect } from 'react';

function ChatComponent() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  // Load models on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/models')
      .then(res => res.json())
      .then(data => setModels(data.data));
  }, []);

  const handleSend = async () => {
    const response = await fetch('http://localhost:8000/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        model: selectedModel || undefined
      })
    });
    
    const data = await response.json();
    setReply(data.data.reply);
  };

  return (
    <div>
      <select onChange={e => setSelectedModel(e.target.value)}>
        <option value="">Default Model</option>
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      
      <input 
        value={message} 
        onChange={e => setMessage(e.target.value)} 
        placeholder="Type your message..."
      />
      
      <button onClick={handleSend}>Send</button>
      
      {reply && <div>AI: {reply}</div>}
    </div>
  );
}
```

## Available Models

| Model ID | User-Friendly Name | Best For | Cost |
|----------|-------------------|----------|------|
| `meta-llama/llama-3.2-3b-instruct:free` | Llama 3.2 3B | General conversation, fast responses | FREE |
| `google/gemma-2-9b-it:free` | Gemma 2 9B | Advanced reasoning, creative tasks | FREE |
| `deepseek/deepseek-r1:free` | DeepSeek R1 | Reasoning, problem-solving, code | FREE |
| `x-ai/grok-2-1212` | Grok 2 (xAI) | Conversational AI, real-time knowledge | Paid |

## Notes

- Most listed models are **FREE** to use on OpenRouter (Grok 2 requires payment)
- The `model` field is **optional** in chat requests
- If no model is specified, the system uses the default from `.env` or the hardcoded fallback
- You can add more models to the list by editing `src/routes/models.routes.ts`
- Model availability may change; check [OpenRouter's website](https://openrouter.ai/models) for the latest list

## Troubleshooting

**Error: "No endpoints found for [model-name]"**
- The model might be temporarily unavailable
- Try a different model from the list
- Check OpenRouter's status page

**Model selection not working:**
- Ensure you're sending the correct `model` field in the request body
- Verify the model ID matches exactly (case-sensitive)
- Check server logs for any errors

