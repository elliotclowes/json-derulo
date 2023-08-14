require('dotenv').config();
const { db } = require('../database/firebase')
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');
const { processAudioUpload } = require('./audioUpload');

const API_TOKEN = process.env.AAI_KEY;

exports.saveAudio = async (req, res) => {
    const documentId = req.body.documentId;
  
    try {
      res.send('File uploaded.');
  
      processAudioUpload(req.file.path, documentId);
    } catch (error) {
      res.status(500).send(`Error processing audio file: ${error.message}`);
    }
  };
