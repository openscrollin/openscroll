import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;

const VOICE_MAP = {
  en: 'EXAVITQu4vr4xnSDxMaL', // English voice
  hi: 'TxGEqnHWrfWFTfGW9XjX', // Hindi voice
};

const translateToHindi = async (text) => {
  try {
    const response = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: 'en',
      target: 'hi',
      format: 'text',
    }, {
      headers: { accept: 'application/json' },
    });

    return response.data.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return null;
  }
};

export const getSpeechFromText = async (text, language = 'en') => {
  const voiceId = VOICE_MAP[language];

  if (language === 'hi') {
    const translated = await translateToHindi(text);
    if (!translated) return null;
    text = translated;
  }

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: language === 'hi' ? 'eleven_multilingual_v2' : 'eleven_monolingual_v1',
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
      }
    );

    return response.data;
  } catch (err) {
    console.error('TTS generation failed:', err);
    return null;
  }
};
