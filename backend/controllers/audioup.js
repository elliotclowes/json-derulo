require('dotenv').config();
const { db } = require('../database/firebase')
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');
const { processAudioUpload } = require('./audioUpload');

const API_TOKEN = process.env.AAI_KEY;

exports.saveAudio = async (req, res) => {
    const documentId = req.body.documentId;
  
    try {
        
        const summary = await processAudioUpload(req.file.path, documentId);
        res.status(200).send(summary); 
        console.log(summary, 'banana'); // Log the summary here
    } catch (error) {
      res.status(500).send(`Error processing audio file: ${error.message}`);
    }
  };
