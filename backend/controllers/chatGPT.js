require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const encoder = require('gpt-3-encoder');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const trimToTokenLimit = (text, limit) => {
  let tokens = encoder.encode(text);

  while (tokens.length > limit) {
    text = text.substring(150);
    tokens = encoder.encode(text);
  }

  return text;
};


const summarizeTranscript = async (prompt, content) => {
  try {
    const TOKEN_LIMIT = 3900;
    // Trim the content to the token limit
    content = trimToTokenLimit(content, TOKEN_LIMIT);

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }, { role: "assistant", content: content }],
    });

    const summary = chatCompletion.data.choices[0].message.content;
    console.log("🚀 ~ file: chatGPT.js:20 ~ summarizeTranscript ~ chatCompletion:", chatCompletion.data)
    return summary;

  } catch (error) {
    console.error('Error summarizing transcript:', error);
  }
};

module.exports = { summarizeTranscript };