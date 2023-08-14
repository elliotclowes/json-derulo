require('dotenv').config();
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');
const { db, bucket } = require('../database/firebase');
const pathModule = require('path');

const API_TOKEN = process.env.AAI_KEY;
async function processAudioUpload(path, documentId) {
    try {
      const uploadUrl = await uploadFile(path);
      const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
      const text = 'I want you to create a summary of the contents of the following transcript:' + transcript.text;
  
     
      const summary = await summarizeTranscript(text);
  
      
      const transcriptInfo = "The transcript contains the sentence: " + transcript.text;
      console.log('Audio processing complete:', transcriptInfo);
      
      res.status(200).send(transcriptInfo);
      console.log('Audio processing complete:', summary);
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  }
  module.exports = { processAudioUpload };
