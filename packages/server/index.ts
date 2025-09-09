import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z, { json } from 'zod';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from root route');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({
    message: 'Hello world from server',
  });
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversations = new Map<string, string>();
// convestaionId -> lastResponseId
// conv1-> 100
//conv2 -> 200

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(100, 'Prompt is no longer then 100 words'),
  conversationId: z.string().uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json(parseResult.error.format());
    return;
  }
  try {
    const { prompt, conversationId } = await req.body;

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
    });
    conversations.set(conversationId, response.id);
    res.json({ message: response.output_text });
  } catch (error) {
    res.status(500).json({ error: 'Faild to generate a response' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
