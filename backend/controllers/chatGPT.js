require('dotenv').config();
const https = require('https');

const apiKey = process.env.OPENAI_API_KEY;

async function summarizeTranscript(transcriptText) {

  const apiUrl = 'https://api.openai.com';
  const path = '/v1/engines/text-davinci-003/completions';

  // Create a prompt to ask ChatGPT to summarize the transcript text
  const prompt = `Please summarize the following transcript:\n\n${transcriptText}`;

  const requestBody = JSON.stringify({
    prompt: prompt,
    max_tokens: 4096
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
          const summary = responseJson.choices[0].text.trim();
          resolve(summary);
        }
      });
    });

    httpsRequest.on('error', (error) => {
      reject({ error: 'An error occurred while summarizing the transcript.', details: error });
    });

    httpsRequest.write(requestBody);
    httpsRequest.end();
  });
}

module.exports = { summarizeTranscript };
