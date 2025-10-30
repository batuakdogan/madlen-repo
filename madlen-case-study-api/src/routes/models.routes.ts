import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/v1/models:
 *   get:
 *     summary: Lists available AI models for selection
 *     description: Returns a list of free AI models available on OpenRouter that users can choose from
 *     tags:
 *       - Models
 *     responses:
 *       200:
 *         description: Successfully retrieved list of available models
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The model identifier used in API requests
 *                         example: "meta-llama/llama-3.2-3b-instruct:free"
 *                       name:
 *                         type: string
 *                         description: User-friendly name for the model
 *                         example: "Llama 3.2 3B (Free)"
 */
router.get('/', (req: Request, res: Response) => {
  const models = [
    {
      id: 'meta-llama/llama-3.2-3b-instruct:free',
      name: 'Llama 3.2 3B (Free)'
    },
    {
      id: 'google/gemma-2-9b-it:free',
      name: 'Gemma 2 9B (Free)'
    }
  ];

  res.status(200).json({
    success: true,
    data: models
  });
});

export default router;

