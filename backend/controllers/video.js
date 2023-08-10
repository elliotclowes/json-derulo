const axios = require('axios');
const { summarizeTranscript } = require('./chatGPT'); // Assuming this is correctly imported
const admin = require('firebase-admin');
const db = admin.firestore();

async function fetchSubtitles(req, res) {
  const youtubeUrl = req.body.url;
  const apiUrl = "http://178.128.39.115:8000/download_subtitles";
  
  try {
    const response = await axios.post(apiUrl, { url: youtubeUrl });
    const transcriptData = response.data; // Assuming this is the data received from the API

    // Convert transcriptData to a string using JSON.stringify
    const transcript = JSON.stringify(transcriptData);
    
    console.log(transcript, 'fish');

    // Assuming the summarizeTranscript function is defined in './chatGPT'
    const summary = await summarizeTranscript(transcript); // Summarize the extracted subtitles
    const summaryRef = db.collection('summaries').doc();
    await summaryRef.set({ summary: summary }); 
    console.log(summary, 'banana');
    res.status(200).json({ summary });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while fetching and summarizing subtitles." });
  }
}

module.exports = fetchSubtitles;
