import express from 'express';
import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

const router = express.Router();

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(100, 'Prompt is no longer then 100 words'),
  conversationId: z.string().uuid(),
});

export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json(parseResult.error.format());
      return;
    }

    try {
      const { prompt, conversationId } = await req.body;
      const response = await chatService.sendMessage(prompt, conversationId);
      res.json({ message: response.message });
    } catch (error) {
      res.status(500).json({ error: 'Faild to generate a response' });
    }
  },
};

export default router;
