const https = require('https');
require("dotenv").config()

const aiApiKey = process.env.OPENAI_API_KEY;

const summarizeTranscript = (transcript) => {
  return new Promise((resolve, reject) => {
    const apiKey = aiApiKey;
    const apiUrl = 'api.openai.com';
    const path = '/v1/chat/completions';

    const prompt = `How many words are there? ${transcript}`;

  const requestBody = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
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
      // Resolve the promise with the result
      resolve(response.choices[0].message.content);
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
