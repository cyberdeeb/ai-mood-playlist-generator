import OpenAI from 'openai';
const express = require('express');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', async(req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `What is the mood of this text? Return just one word. Text: ${text}`
        }
      ],
      max_tokens: 5
    });

    const mood = response.choices[0].message.content.trim().lowerCase();
    res.json({ mood });
  } catch (error) {
    console.error('Error contacting OpenAI: ', error);
    res.status(500).json({ error: 'Failed to detect mood' });
  }
});

module.exports = router;
