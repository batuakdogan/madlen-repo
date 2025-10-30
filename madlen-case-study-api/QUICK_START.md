# Quick Start Guide

## 🚀 Getting Started

### 1. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8000` with hot reload enabled.

### 2. Access API Documentation

Open your browser and navigate to:
```
http://localhost:8000/api-docs
```

This provides an interactive Swagger UI where you can test all API endpoints.

### 3. Test the Chat Endpoint

You can test the API using curl, Postman, or the Swagger UI:

**Using curl:**
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, tell me a joke!"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Why did the programmer quit his job? Because he didn't get arrays!"
  }
}
```

### 4. Health Check

Verify the server is running:
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

## 📁 Project Structure

```
src/
├── index.ts                 # Main application entry point
├── controllers/             # Request/Response handlers
│   └── chat.controller.ts   # Chat endpoint controller
├── services/                # Business logic
│   └── chat.service.ts      # OpenRouter integration
├── routes/                  # API routes
│   └── chat.routes.ts       # Chat route definitions + Swagger docs
└── utils/                   # Helper functions
    └── swagger.ts           # Swagger configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the production build

## 🌟 Key Features

✅ TypeScript with ES Modules  
✅ Layered architecture (Routes → Controllers → Services)  
✅ OpenRouter AI integration  
✅ Swagger API documentation  
✅ CORS enabled  
✅ Environment variable configuration  
✅ Error handling with proper HTTP status codes  
✅ Consistent API response format  

## 📝 API Response Format

All API responses follow this structure:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔐 Environment Variables

Required variables in `.env`:
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `OPENROUTER_MODEL` - AI model to use (default: `meta-llama/llama-3.2-3b-instruct:free`)
- `PORT` - Server port (default: 8000)

💡 **Tip:** Check `AVAILABLE_MODELS.md` to see all available AI models and switch between them!

## 🧪 Testing the API

1. **Start the server:** `npm run dev`
2. **Open Swagger UI:** `http://localhost:8000/api-docs`
3. **Click on "POST /api/v1/chat"**
4. **Click "Try it out"**
5. **Enter a message in the request body**
6. **Click "Execute"**
7. **View the AI response**

## 🎯 Next Steps

- Add request validation using Zod schemas
- Implement rate limiting
- Add authentication middleware
- Set up logging with Winston or Pino
- Add unit and integration tests
- Implement additional AI models
- Add conversation history storage

