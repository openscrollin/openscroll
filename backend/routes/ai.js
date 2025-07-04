const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// ✅ OpenAI v4 client init
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai-enhance
router.post('/ai-enhance', async (req, res) => {
  const { text, mode } = req.body;

  if (!text || !mode) {
    return res.status(400).json({ message: 'Text and mode are required' });
  }

  let prompt = '';
  switch (mode) {
    case 'rephrase':
      prompt = `Rephrase this professionally:\n\n${text}`;
      break;
    case 'correct':
      prompt = `Correct grammar and spelling:\n\n${text}`;
      break;
    case 'tone':
      prompt = `Make this sound more friendly and engaging:\n\n${text}`;
      break;
    default:
      return res.status(400).json({ message: 'Invalid mode' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const enhancedText = completion.choices[0].message.content;
    console.log('✅ AI Response:', enhancedText);
    res.json({ result: enhancedText });
  } catch (error) {
    console.error('🔴 OpenAI API ERROR:', error.response?.data || error.message);
    const errorMsg =
      error.response?.data?.error?.message ||
      error.message ||
      'AI enhancement failed';
    res.status(500).json({ message: errorMsg });
  }
});

module.exports = router;
