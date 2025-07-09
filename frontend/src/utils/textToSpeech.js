import axios from 'axios';

const ELEVENLABS_API_KEY = "sk_d024ab1a39d913d35f5cf5afb7bf5494b4c5e4450eac29bf";

const VOICE_MAP = {
  en: 'EXAVITQu4vr4xnSDxMaL', // English voice
  hi: 'TxGEqnHWrfWFTfGW9XjX', // Hindi voice
};

// Browser fallback TTS using Web Speech API
const getBrowserTTS = async (text, language = 'en') => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Browser does not support speech synthesis'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      resolve(true);
    };

    utterance.onerror = (error) => {
      reject(error);
    };

    window.speechSynthesis.speak(utterance);
  });
};

// We'll use ElevenLabs' multilingual model directly instead of translating
// This is more reliable and uses the same API key
const translateToHindi = async (text) => {
  // For now, we'll use the original English text with ElevenLabs' multilingual model
  // ElevenLabs can handle English text with Hindi voice
  console.log('Using ElevenLabs multilingual model for Hindi speech');
  return text;
};

export const getSpeechFromText = async (text, language = 'en') => {
  const voiceId = VOICE_MAP[language];

  // For Hindi, we'll use the original English text with ElevenLabs' multilingual model
  // ElevenLabs Hindi voice can handle English text and pronounce it with Hindi accent
  if (language === 'hi') {
    console.log('Hindi selected, using ElevenLabs multilingual model...');
    // Keep the original text for better pronunciation
  }

  // First try ElevenLabs API
  if (ELEVENLABS_API_KEY) {
    try {
      console.log(`Generating ${language} speech for text:`, text.substring(0, 100) + '...');
      
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
          timeout: 30000, // 30 second timeout for audio generation
        }
      );

      console.log('TTS generation successful');
      return response.data;
    } catch (err) {
      console.error('ElevenLabs TTS generation failed:', err.response?.data || err.message);
      // Fall back to browser TTS
      console.log('Falling back to browser TTS...');
    }
  } else {
    console.log('ElevenLabs API key not found, using browser TTS');
  }

  // Fallback to browser TTS
  try {
    await getBrowserTTS(text, language);
    return 'browser-tts'; // Special identifier for browser TTS
  } catch (browserError) {
    console.error('Browser TTS also failed:', browserError);
    return null;
  }
};
