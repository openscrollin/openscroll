const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/ai-suggest', async (req, res) => {
  const { text } = req.body;
  const prompt = `
Suggest grammar, style, and tone improvements for the following text. 
Respond as a JSON array of objects with type, text, suggestion, and position fields. 
Text: """${text}"""
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.2,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    let suggestions = [];
    try {
      suggestions = JSON.parse(response.data.choices[0].message.content);
    } catch (e) {}
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ suggestions: [], error: 'AI error' });
  }
});

module.exports = router;