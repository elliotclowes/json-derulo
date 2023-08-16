require('dotenv').config();
const fs = require('fs');
const { db } = require('../database/firebase')
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript, shortenTranscript } = require('./chatGPT');
const { processAudio } = require('./audioProcessing');

const API_TOKEN = process.env.AAI_KEY;


exports.saveAudio = async (req, res) => {
  const path = `./uploads/${req.file.originalname}`;
  const documentId = req.body.documentId; // Extract the documentId from the request
  console.log(documentId,'applesauce')
  fs.rename(req.file.path, path, async err => {
    if (err) {
      res.status(500).send(`Error saving audio file: ${err}`);
      return;
    }

    try {
      res.send('File uploaded and saved.'); // Send immediate response

      // Pass the documentId to processAudio
      processAudio(path, documentId);
    } catch (error) {
      res.status(500).send(`Error processing audio file: ${error.message}`);
    }
  });
};


exports.summarizeTranscript = async (req, res) => {
  try {
    const { prompt, content } = req.body; // Extract prompt and content from the request
    console.log("🚀 ~ file: audio.js:36 ~ exports.summarizeTranscript= ~ content:", content)
    console.log("🚀 ~ file: audio.js:36 ~ exports.summarizeTranscript= ~ prompt:", prompt)
    const summary = await summarizeTranscript(prompt, content);
    console.log("🚀 ~ file: audio.js:39 ~ exports.summarizeTranscript= ~ summary:", summary)
    res.status(200).send(summary);
  } catch (error) {
    res.status(500).send(`Error summarizing transcript: ${error.message}`);
  }
};



exports.shortenTranscript = async (req, res) => {
  try {
    const { documentId, prompt, content } = req.body; // Extract prompt and content from the request
    console.log("🚀 ~ file: audio.js:36 ~ exports.summarizeTranscript= ~ content:", content)
    console.log("🚀 ~ file: audio.js:36 ~ exports.summarizeTranscript= ~ prompt:", prompt)
    const summary = await shortenTranscript(prompt, content);
    const store = await shortenTranscript(documentId, summarycontent);
    console.log("🚀 ~ file: audio.js:39 ~ exports.summarizeTranscript= ~ summary:", summary)
    res.status(200).send(store);
  } catch (error) {
    res.status(500).send(`Error summarizing transcript: ${error.message}`);
  }
};
