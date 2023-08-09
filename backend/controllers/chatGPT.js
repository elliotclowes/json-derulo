const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const summarizeTranscript = async (transcript) => {
  try {
    const prompt = `I want you to create a summary of the contents of the following transcript. If any formatting is need make sure you use HTML. Don't make any mention of the transcript. Just give your summary. This is the transcript: ${transcript}`;
    
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
    });

    const content = chatCompletion.data.choices[0].message;
    
    return content;
    
  } catch (error) {
    throw { error: 'An error occurred while getting word count.', details: error };
  }
};

module.exports = { summarizeTranscript };
