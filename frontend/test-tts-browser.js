// Simple test to verify TTS is working
console.log("Testing TTS functionality...");

// Test the fetch-based approach
const testTTS = async () => {
  const API_KEY = "sk_d024ab1a39d913d35f5cf5afb7bf5494b4c5e4450eac29bf";
  const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";
  
  try {
    console.log("Making TTS request...");
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text: "Hello, this is a test of the text-to-speech functionality.",
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      }),
    });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (response.ok) {
      const blob = await response.blob();
      console.log("Audio blob received, size:", blob.size);
      const url = URL.createObjectURL(blob);
      console.log("Audio URL created:", url);
      
      // Test playing the audio
      const audio = new Audio(url);
      audio.play().then(() => {
        console.log("Audio is playing!");
      }).catch(e => {
        console.error("Error playing audio:", e);
      });
      
      return true;
    } else {
      console.error("Request failed:", response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

// Run the test
testTTS();
