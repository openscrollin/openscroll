const express = require('express');
const axios = require('axios');
const router = express.Router();

// ElevenLabs TTS endpoint
router.post('/tts', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const API_KEY = "sk_d024ab1a39d913d35f5cf5afb7bf5494b4c5e4450eac29bf";
    const VOICE_MAP = {
      en: 'EXAVITQu4vr4xnSDxMaL', // English voice
      hi: 'TxGEqnHWrfWFTfGW9XjX', // Hindi voice
    };

    const voiceId = VOICE_MAP[language];
    
    console.log(`Generating ${language} audio for text length: ${text.length}`);
    
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text.slice(0, 2500), // Limit text length
        model_id: language === 'hi' ? 'eleven_multilingual_v2' : 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        responseType: 'stream',
        timeout: 30000,
      }
    );

    // Set appropriate headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="speech.mp3"');
    
    // Pipe the audio stream to the response
    response.data.pipe(res);
    
  } catch (error) {
    console.error('TTS Error:', error.response?.data || error.message);
    
    let statusCode = 500;
    let errorMessage = 'Failed to generate audio';
    
    if (error.response?.status === 401) {
      statusCode = 401;
      errorMessage = 'Invalid API key';
    } else if (error.response?.status === 429) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded';
    } else if (error.response?.status === 400) {
      statusCode = 400;
      errorMessage = 'Invalid request';
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
});

module.exports = router;
