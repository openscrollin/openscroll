const axios = require('axios');
require('dotenv').config();

const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // English voice

console.log('API Key:', ELEVENLABS_API_KEY ? 'Found' : 'Not found');

const testTTS = async () => {
  try {
    console.log('Testing ElevenLabs TTS...');
    
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: 'Hello, this is a test of the text to speech functionality.',
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'blob',
        timeout: 30000,
      }
    );

    console.log('TTS generation successful!');
    console.log('Response size:', response.data.size, 'bytes');
    console.log('Response type:', response.data.type);
    
  } catch (err) {
    console.error('TTS generation failed:');
    console.error('Status:', err.response?.status);
    console.error('Status text:', err.response?.statusText);
    console.error('Response data:', err.response?.data);
    console.error('Error message:', err.message);
  }
};

testTTS();
