import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controller/chat.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello from root route');
});

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({
    message: 'Hello world from server',
  });
});

router.post('/api/chat', chatController.sendMessage);

export default router;
