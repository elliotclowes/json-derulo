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




const shortenTranscript = async (data) => {
  try {
    // Extract prompt and content from the passed data
    const { prompt, content: rawContent } = data;

    // Set the token limit
    const TOKEN_LIMIT = 3900;
    
    // Trim the content to the token limit
    const content = trimToTokenLimit(rawContent, TOKEN_LIMIT);

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: content }
      ],
    });

    const summary = chatCompletion.data.choices[0].message.content;
    console.log("🚀 ~ file: chatGPT.js:20 ~ summarizeTranscript ~ chatCompletion:", chatCompletion.data)
    return summary;

  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      console.log(rawContent);
    } else {
      console.log(error.message);
    }
  }


  async function processAudio(path, documentId) {
    try {
      const uploadUrl = await uploadFile(path);
      const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
      const prompt = 'I want you to create a summary of the contents of the following transcript:'
      const content = transcript.text;
  
      const filename = pathModule.basename(path);
      const destination = `audio/${filename}`; // Set the destination path in the bucket
      const [file] = await bucket.upload(path, { destination });
  
      // Make the file publicly accessible. TODO: NEEDS TO BE MADE ONLY VIEWABLE BY THE USER AT SOME POINT
      await file.makePublic();
  
      // Get the public URL of the file
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`; // Construct the public URL
  
      summarizeTranscript(prompt, content).then(async (summary) => {
        console.log('Audio processing complete:', summary);
  
        // Get the document reference
        const docRef = db.collection('summaries').doc(documentId);
      
        // Get the current data
        const doc = await docRef.get();
        const data = doc.data();
  
        // Generate new block ID
        const newBlockId = `block${data.blockOrder.length + 1}`;
  
        // Add the new block ID to the block order
        data.blockOrder.push(newBlockId);
  
        // Add the new block with the summary text
        data.blocks[newBlockId] = {
          text: [
            {
              type: "p",
              children: [{ text: summary }]
            }
          ],
          audioURL: publicUrl,
          comments: [] // Initialize with empty comments 
        };
  
        // Update the document with the new data
        await docRef.update(data);
  
  
      }).catch(error => {
        console.error('Error summarizing transcript:', error);
      });
  
    } catch (error) {
      console.error('Error processing audio:', error);
    }


  }
};



module.exports = { summarizeTranscript, shortenTranscript };
