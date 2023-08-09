// backend/controllers/chatGPT.js
require('dotenv').config();
const https = require('https');

const apiKey = process.env.OPENAI_API_KEY;

const axios = require('axios');
const axiosRetry = require('axios-retry');

axiosRetry(axios, {
  retries: 3, // Number of retries
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Time between retries increases by 1s
  },
  // Retry on StatusCode 500
  retryCondition: (error) => {
    return error.response && error.response.status === 500;
  },
});

const axiosInstance = axios.create({
  timeout: 60000, // Set timeout to 60 seconds (or adjust as needed)
});
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response && error.response.status === 500;
  },
});

async function summarizeTranscript(transcriptText) {
  console.log("🚀 ~ file: chatGPT.js:40 ~ summarizeTranscript ~ apiKey:", apiKey);
  console.log("🚀 ~ file: chatGPT.js:21 ~ summarizeTranscript ~ transcriptText:", transcriptText);
  const apiUrl = 'https://api.openai.com';
  const path = '/v1/engines/text-davinci-003/completions';

  // Create a prompt to ask ChatGPT to summarize the transcript text
  const prompt = `How many words are there?:\n\n${transcriptText}`;

  console.log("🚀 ~ file: chatGPT.js:28 ~ summarizeTranscript ~ prompt:", prompt);

  const requestBody = {
    prompt: prompt,
    max_tokens: 4000
  };
  console.log("🚀 ~ file: chatGPT.js:37 ~ summarizeTranscript ~ requestBody:", requestBody);

  const options = {
    method: 'POST',
    url: apiUrl + path,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    data: requestBody
  };

  try {
    const response = await axiosInstance(options);

    if (response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].text.trim();
    }

    throw new Error('No summary generated.');
  } catch (error) {
    throw new Error(`Error summarizing transcript: ${error.message}`);
  }
}

module.exports = { summarizeTranscript };
