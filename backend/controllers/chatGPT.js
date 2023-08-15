require("dotenv").config()

const { Configuration, OpenAIApi } = require("openai");
const encoder = require('gpt-3-encoder');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// This function makes sure the text is under the token limit. If it isn't then it shortens the text by 150 characters and then tries again. It does this until it's under the limit.
const trimToTokenLimit = (text, limit) => {
  // Encode the text
  let tokens = encoder.encode(text);

  // Check the number of tokens against the limit
  while (tokens.length > limit) {
    // Remove the first 150 characters
    text = text.substring(150);

    // Re-encode the shortened text
    tokens = encoder.encode(text);
  }

  return text;
};
 

const summarizeTranscript = async (prompt, content) => {
  try {
    // Set the token limit
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
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      console.log(content)
    } else {
      console.log(error.message);
    }
  }
};

module.exports = { summarizeTranscript };
