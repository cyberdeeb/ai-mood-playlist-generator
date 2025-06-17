import express, { Request, Response } from 'express';
import OpenAI from 'openai';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { text } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `What is the mood of this text? Return just one word. Text: ${text}`,
        },
      ],
      max_tokens: 5,
    });

    const content = response.choices[0].message?.content;

    if (!content) {
      console.error('OpenAI returned empty content');
      res.status(500).json({ error: 'No mood returned' });
      return;
    }

    const mood = content.trim().toLowerCase();
    res.json({ mood });
    
  } catch (error) {
    console.error('Error contacting OpenAI:', error);
    res.status(500).json({ error: 'Failed to detect mood' });
  }
});

export default router;
