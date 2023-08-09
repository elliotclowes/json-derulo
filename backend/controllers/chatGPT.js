const https = require('https');
require("dotenv").config()

const aiApiKey = process.env.OPENAI_API_KEY;

const summarizeTranscript = (transcript) => {
  return new Promise((resolve, reject) => {
    const apiKey = aiApiKey;
    const apiUrl = 'api.openai.com';
    const path = '/v1/chat/completions';

    const prompt = `I want you to create a summary of the contents of the following transcript: ${transcript}`;

    const requestBody = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    const options = {
      hostname: apiUrl,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    };

    const httpsRequest = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', async () => {
        const response = JSON.parse(data);
        const content = response.choices[0].message.content;
        
        // Check if the response contains the specific phrase
        if (content.includes("I'm sorry, but as an AI language model")) {
          reject({ error: 'Response wasnt properly summarised' });
        } else {
          // Resolve the promise with the result
          resolve(content);
        }
      });
    });

    httpsRequest.on('error', (error) => {
      // Reject the promise if an error occurs
      reject({ error: 'An error occurred while getting word count.', details: error });
    });

    httpsRequest.write(requestBody);
    httpsRequest.end();
  });
};

module.exports = { summarizeTranscript };
