import { Router } from 'express';
import { handleChatMessage, getChatHistory } from '../controllers/chat.controller.js';

const router = Router();

/**
 * @swagger
 * /api/v1/chat:
 *   post:
 *     summary: Send a message to the AI chatbot
 *     description: Sends a user message to the OpenRouter API and returns the AI's response
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The message to send to the AI
 *                 example: "Hello, how are you?"
 *               model:
 *                 type: string
 *                 description: Optional AI model ID to use. If not provided, uses the default model from environment variables.
 *                 example: "meta-llama/llama-3.2-3b-instruct:free"
 *               sessionId:
 *                 type: string
 *                 description: Optional session ID to continue an existing conversation. If not provided, a new session will be created.
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Successfully received AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     reply:
 *                       type: string
 *                       example: "Hello! I'm doing well, thank you for asking."
 *                     sessionId:
 *                       type: string
 *                       description: The session ID for this conversation
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *       400:
 *         description: Bad request - missing or invalid message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Message is required and must be a string"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/', handleChatMessage);

/**
 * @swagger
 * /api/v1/chat/history/{sessionId}:
 *   get:
 *     summary: Get chat history for a session
 *     description: Retrieves the complete conversation history for a given session ID
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID to retrieve history for
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Successfully retrieved chat history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             enum: [user, assistant]
 *                             example: "user"
 *                           content:
 *                             type: string
 *                             example: "Hello, how are you?"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/history/:sessionId', getChatHistory);

export default router;

