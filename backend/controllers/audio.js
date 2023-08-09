require('dotenv').config();
const fs = require('fs');
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');
const { processAudio } = require('./audioProcessing');

const admin = require('firebase-admin');

const API_TOKEN = process.env.AAI_KEY;

const serviceAccount = require('../firebase-credentials.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


exports.saveAudio = async (req, res) => {
  const path = `./uploads/${req.file.originalname}`;

  fs.rename(req.file.path, path, async err => {
    if (err) {
      res.status(500).send(`Error saving audio file: ${err}`);
      return;
    }

    try {
      res.send('File uploaded and saved.'); // Send immediate response

      // Perform transcription and processing asynchronously
      processAudio(path);
    } catch (error) {
      res.status(500).send(`Error processing audio file: ${error.message}`);
    }
  });
};
