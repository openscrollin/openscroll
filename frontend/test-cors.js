// Test CORS with ElevenLabs API directly from browser console
const testElevenLabsCORS = async () => {
  const API_KEY = "sk_d024ab1a39d913d35f5cf5afb7bf5494b4c5e4450eac29bf";
  const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text: "Hello, this is a test.",
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const blob = await response.blob();
      console.log('Audio blob size:', blob.size);
      return blob;
    } else {
      console.error('Request failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('CORS Error:', error);
  }
};

// Run the test
testElevenLabsCORS();
