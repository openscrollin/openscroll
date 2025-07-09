const axios = require('axios');

const testTranslation = async () => {
  try {
    console.log('Testing translation...');
    
    const response = await axios.post('https://libretranslate.com/translate', {
      q: 'Hello, this is a test of the translation functionality.',
      source: 'en',
      target: 'hi',
      format: 'text',
    }, {
      headers: { 
        'Content-Type': 'application/json',
        accept: 'application/json' 
      },
      timeout: 10000,
    });

    console.log('Translation successful!');
    console.log('Original:', 'Hello, this is a test of the translation functionality.');
    console.log('Translated:', response.data.translatedText);
    
  } catch (error) {
    console.error('Translation failed:');
    console.error('Status:', error.response?.status);
    console.error('Status text:', error.response?.statusText);
    console.error('Response data:', error.response?.data);
    console.error('Error message:', error.message);
  }
};

testTranslation();
