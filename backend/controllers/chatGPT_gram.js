// ... (other code remains unchanged)

async function checkGrammarAndPunctuation(transcriptText) {
    const apiUrl = 'https://api.openai.com';
    const path = '/v1/engines/davinci-codex/completions'; // Using davinci-codex engine
  
    // Create a prompt to ask the engine to check grammar and punctuation
    const prompt = `Check the grammar and punctuation of the following text:\n\n${transcriptText}`;
  
    const requestBody = JSON.stringify({
      prompt: prompt,
      max_tokens: 3000,
      temperature: 0, // For precise responses
    });
  
    const options = {
      hostname: 'api.openai.com',
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    };
  
    return new Promise((resolve, reject) => {
      const httpsRequest = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          const responseJson = JSON.parse(data);
          if (responseJson.error) {
            reject(new Error(responseJson.error.message));
          } else {
            const correctedText = responseJson.choices[0].text.trim();
            const reducedText = correctedText.substring(0, 200); // Adjust desiredLength
            resolve(reducedText); // Move this line here
          }
        });
      });
  
      httpsRequest.on('error', (error) => {
        reject({ error: 'An error occurred while checking grammar and punctuation.', details: error });
      });
  
      httpsRequest.write(requestBody);
      httpsRequest.end();
    });
  }
  
  module.exports = { checkGrammarAndPunctuation };
  