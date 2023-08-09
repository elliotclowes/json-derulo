require('dotenv').config();
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');
const { db } = require('../database/firebase')
const pathModule = require('path');



const API_TOKEN = process.env.AAI_KEY;

const DOCUMENT_ID = 'HZpgoFnM6Ht4M16YuTWk';

async function processAudio(path) {
  console.log("🚀 ~ file: audioProcessing.js:12 ~ processAudio ~ path:", path)
  try {
    const uploadUrl = await uploadFile(path);
    const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
    const text = 'I want you to create a summary of the contents of the following transcript' + transcript.text;

    // Extract filename from path
    const filename = pathModule.basename(path);

    summarizeTranscript(text).then(async (summary) => {
      console.log('Audio processing complete:', summary);

      // Get the document reference
      const docRef = db.collection('summaries').doc(DOCUMENT_ID);

      // Get the current data
      const doc = await docRef.get();
      const data = doc.data();

      // Generate new block ID
      const newBlockId = `block${data.blockOrder.length + 1}`;

      // Add the new block ID to the block order
      data.blockOrder.push(newBlockId);

      // Add the new block with the summary text
      data.blocks[newBlockId] = {
        text: summary,
        audioURL: filename,
        comments: [] // Initialize with empty comments 
      };

      // Update the document with the new data
      await docRef.set(data);

    }).catch(error => {
      console.error('Error summarizing transcript:', error);
    });

  } catch (error) {
    console.error('Error processing audio:', error);
  }
}
module.exports = { processAudio };
