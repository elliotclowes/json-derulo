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

const generateLearningSuggestions = async (transcript) => {
  try {
    const TOKEN_LIMIT = 3900;
    transcript = trimToTokenLimit(transcript, TOKEN_LIMIT);

    const prompt = `After reading the summary, suggest three bullet points on what to learn next:\n\n${transcript}`;

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "system", content: "You are a helpful assistant that suggests learning points."}],
      max_tokens: 100,
      prompt: prompt
    });

    const content = chatCompletion.data.choices[0].message.content;
    console.log("Generated learning suggestions:", content);
    return content;
  } catch (error) {
    console.error('Error generating learning suggestions:', error);
  }
};

const summarizeTranscript = async (prompt, content) => {
  try {
    const TOKEN_LIMIT = 3900;
<<<<<<< HEAD
    transcript = trimToTokenLimit(transcript, TOKEN_LIMIT);
=======
    // Trim the content to the token limit
    content = trimToTokenLimit(content, TOKEN_LIMIT);
>>>>>>> a7af73ea3a56990d22df17345436d9557b8d36e5

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }, { role: "assistant", content: content }],
    });

<<<<<<< HEAD
    const content = chatCompletion.data.choices[0].message.content;
    console.log("Summarized transcript:", content);
    return content;
    
=======
    const summary = chatCompletion.data.choices[0].message.content;
    console.log("🚀 ~ file: chatGPT.js:20 ~ summarizeTranscript ~ chatCompletion:", chatCompletion.data)
    return summary;

>>>>>>> a7af73ea3a56990d22df17345436d9557b8d36e5
  } catch (error) {
    console.error('Error summarizing transcript:', error);
  }
};

module.exports = { generateLearningSuggestions, summarizeTranscript };