const axios = require('axios');
const { summarizeTranscript } = require('./chatGPT'); // Assuming this is correctly imported
const admin = require('firebase-admin');
const db = admin.firestore();

async function fetchSubtitles(req, res) {
  const youtubeUrl = req.body.url;
  const user_id = req.body.user_id; // Extract user_id from the request body
  const timestamp = req.body.timestamp; 
  const apiUrl = "http://178.128.39.115:8000/download_subtitles";
  
  try {
    const response = await axios.post(apiUrl, { url: youtubeUrl });
    const transcriptData = response.data; // Assuming this is the data received from the API

   
    const transcript = JSON.stringify(transcriptData);
    
    console.log(transcript, 'fish');

    
    const summary = await summarizeTranscript(transcript); 
    const summaryRef = db.collection('summaries.fish').doc();
    await summaryRef.set({ 
      summary: summary,
      user_id: user_id,
      timestamp: timestamp
    });
    console.log(summary, 'banana');
    res.status(200).json({ summary });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while fetching and summarizing subtitles." });
  }
}

module.exports = fetchSubtitles;
