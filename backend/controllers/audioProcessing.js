require('dotenv').config();
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');
const { db } = require('../database/firebase')


const API_TOKEN = process.env.AAI_KEY;

async function processAudio(path) {
    try {
      const uploadUrl = await uploadFile(path);
      const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
      const text = transcript.text;
  
      // Call summarizeTranscript with text and handle the response
      summarizeTranscript(text).then(async (summary) => {
        console.log('Audio processing complete:', summary);
  
        // Save the summary to Firestore
        const summaryRef = db.collection('summaries').doc();
        await summaryRef.set({ summary });
      }).catch(error => {
        console.error('Error summarizing transcript:', error);
      });
  
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  }
module.exports = { processAudio };
