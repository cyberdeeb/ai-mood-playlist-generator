import express, { Request, Response } from 'express';
import OpenAI from 'openai';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { text } = req.body;

  // Input validation
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res
      .status(400)
      .json({ error: 'Text is required and must be a non-empty string' });
    return;
  }

  if (text.length > 1000) {
    res.status(400).json({ error: 'Text must be less than 1000 characters' });
    return;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Determine the overall emotional mood of the following passage. Return one descriptive word that captures the dominant emotion or atmosphere (e.g., serene, bitter, tense, joyful, somber, exhilarated, etc.). Text: ${text}`,
        },
      ],
      max_tokens: 10, // Increased from 5 to allow for longer mood words
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      console.error('OpenAI returned empty content');
      res.status(500).json({ error: 'Unable to analyze mood' });
      return;
    }

    const mood = content.trim().toLowerCase();
    console.log(`Detected mood: ${mood} for text: ${text.substring(0, 50)}...`);
    res.json({ mood });
  } catch (error: any) {
    console.error('Error contacting OpenAI:', error);

    // Handle specific OpenAI errors
    if (error.status === 401) {
      res.status(500).json({ error: 'API key configuration error' });
    } else if (error.status === 429) {
      res.status(503).json({ error: 'Service temporarily unavailable' });
    } else if (error.status >= 500) {
      res.status(503).json({ error: 'External service error' });
    } else {
      res.status(500).json({ error: 'Failed to detect mood' });
    }
  }
});

export default router;
