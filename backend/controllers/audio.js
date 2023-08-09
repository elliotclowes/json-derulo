require('dotenv').config();
const fs = require('fs');
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');

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
    if (err) throw err;

    try {
      const uploadUrl = await uploadFile(path);
      const transcript = await transcribeAudio(API_TOKEN, uploadUrl); // Pass both API_TOKEN and uploadUrl
      const text = transcript.text; // Extract the text
      console.log("🚀 ~ file: audio.js:26 ~ exports.saveAudio= ~ text:", text)

      // Call the summarizeTranscript function to get the summary
      const summary = await summarizeTranscript(text);
      console.log("🚀 ~ file: audio.js:29 ~ exports.saveAudio= ~ summary:", summary)

      // Save the summary to Firestore
      const summaryRef = db.collection('summaries').doc();
      await summaryRef.set({ summary });

      res.send('File uploaded, transcribed, summarized, and saved to Firestore.');
    } catch (error) {
      res.status(500).send(`Error processing audio file: ${error.message}`);
    }
  });
};
