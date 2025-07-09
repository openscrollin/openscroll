const axios = require('axios');

const testMyMemoryTranslation = async () => {
  try {
    console.log('Testing MyMemory translation...');
    
    const text = 'Hello, this is a test of the translation functionality.';
    const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`, {
      timeout: 10000,
    });

    console.log('Translation successful!');
    console.log('Original:', text);
    console.log('Translated:', response.data.responseData.translatedText);
    console.log('Quality:', response.data.responseData.match);
    
  } catch (error) {
    console.error('MyMemory translation failed:');
    console.error('Status:', error.response?.status);
    console.error('Status text:', error.response?.statusText);
    console.error('Response data:', error.response?.data);
    console.error('Error message:', error.message);
  }
};

testMyMemoryTranslation();
