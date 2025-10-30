# Madlen Case Study API

A TypeScript-based backend service that enables users to chat with various AI models via the OpenRouter service.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Package Manager:** npm
- **Core Libraries:** express, dotenv, cors, axios, zod
- **Documentation:** Swagger UI

## Project Structure

```
src/
├── controllers/     # HTTP request/response handlers
├── services/        # Business logic layer
├── routes/          # API route definitions
└── utils/           # Utility functions (Swagger config)
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
OPENROUTER_API_KEY="your-api-key-here"
OPENROUTER_MODEL="meta-llama/llama-3.2-3b-instruct:free"
PORT=8000
```

See `AVAILABLE_MODELS.md` for a complete list of available AI models.

## Development

Run the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:8000`

**Access Swagger UI Documentation:**
Once the server is running, open your browser and go to:
```
http://localhost:8000/api-docs
```

## Running Jaeger for Observability

This project includes OpenTelemetry instrumentation for distributed tracing. Follow these steps to visualize traces:

1. **Make sure you have Docker installed and running.**

2. **Start Jaeger using Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Start the backend:**
   ```bash
   npm run dev
   ```

4. **View traces in Jaeger UI:**
   Open your browser and navigate to:
   ```
   http://localhost:16686
   ```

5. **Make some API requests** to generate traces, then refresh the Jaeger UI to see the distributed traces of your requests flowing through the application.

6. **Stop Jaeger when done:**
   ```bash
   docker-compose down
   ```

### What's Being Traced?

- All HTTP requests to the Express server
- Database queries (if configured)
- External API calls (e.g., to OpenRouter)
- Custom spans for specific operations

The tracing data helps you understand request flow, identify bottlenecks, and debug issues in production.

## Production

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Documentation

Once the server is running, access the interactive API documentation at:
```
http://localhost:8000/api-docs
```

## Available Endpoints

### POST /api/v1/chat
Send a message to the AI chatbot and receive a response. Supports session-based conversations.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "sessionId": "optional-uuid-for-continuing-conversation",
  "model": "optional-model-id"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "reply": "Hello! I'm doing well, thank you for asking.",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Message is required and must be a string"
}
```

### GET /api/v1/chat/history/:sessionId
Retrieve the complete conversation history for a given session.

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "history": [
      { "role": "user", "content": "Hello!" },
      { "role": "assistant", "content": "Hi there!" }
    ]
  }
}
```

### GET /api/v1/models
List all available AI models for selection.

### GET /health
Health check endpoint to verify server status.

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Architecture

This project follows a layered architecture:

- **Routes Layer:** Defines HTTP endpoints and maps them to controllers
- **Controllers Layer:** Handles request/response lifecycle and validation
- **Services Layer:** Contains business logic (framework-agnostic)
- **Integration Layer:** Manages external API communications

## Development Guidelines

- All code uses ES Modules (import/export)
- Follow async/await pattern for asynchronous operations
- All API routes are prefixed with `/api/v1/`
- Consistent JSON response structure with `success` and `data`/`error` fields
- Comprehensive error handling with appropriate HTTP status codes
- Session-based conversation management with UUID
- In-memory chat history storage
- Model selection support

## Key Features

- 💬 **Multi-turn Conversations** - Sessions maintain conversation context
- 🤖 **Multiple AI Models** - Choose from different free models
- 📝 **Chat History** - Retrieve complete conversation history
- 🔄 **Auto Session Creation** - Automatic UUID generation for new sessions
- 📚 **Interactive API Docs** - Swagger UI for testing

## Documentation

- `README.md` - This file (overview and quick start)
- `QUICK_START.md` - Detailed getting started guide
- `CHAT_HISTORY_GUIDE.md` - Complete session management documentation
- `MODEL_SELECTION_GUIDE.md` - AI model selection guide
- `AVAILABLE_MODELS.md` - List of all available models
- `VERIFIED_MODELS.md` - Tested and working models
- `OBSERVABILITY_GUIDE.md` - Complete OpenTelemetry & Jaeger guide
- `OBSERVABILITY_QUICKSTART.md` - 5-minute observability setup

