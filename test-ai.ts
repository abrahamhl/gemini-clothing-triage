import { GoogleVisionProvider } from './src/lib/ai/vision';

(async () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.log('AI_TEST_RESULT: FAILED - MISSING_ENV: GOOGLE_SERVICE_ACCOUNT_JSON');
    return;
  }
  
  try {
    const provider = new GoogleVisionProvider();
    // Make a test call to make sure it doesn\'t throw auth errors
    // We won\t send a real image, just test if we can get an error from vision or if it misses token
    const testImage = { base64: 'i5WAAALAAAAAAB1AAAAAAAQA', mimeType: 'image/jpeg' };
    await provider.analyzeItem([testImage]);
    console.log('AI_TEST_RESULT: SUCCESS');
  } catch (e) {
    console.log('AI_TEST_RESULT: FAILED - ERROR: ' + e.message);
  }
})();
