const axios = require('axios');
const { summarizeTranscript } = require('./chatGPT');
const admin = require('firebase-admin');
const db = admin.firestore();


async function fetchSubtitles(req, res) {
  const youtubeUrl = req.body.url; 
  const apiUrl = "http://178.128.39.115:8000/download_subtitles"; 
  try {
    const response = await axios.post(apiUrl, { url: youtubeUrl }); 
    const transcriptText = response.data;
    console.log(transcriptText, 'fish');

    // Assuming the summarizeTranscript function is defined in './chatGPT'
    const summary = await summarizeTranscript(transcriptText); // Summarize the extracted subtitles
    
    // Storing the original subtitles and the summary in Firestore
    const summaryRef = db.collection('summaries').doc();
    await summaryRef.set({ originalSubtitles: transcriptText, summary });
    console.log(summary, 'banana'); 
    res.status(200).json({ summary }); // Respond with the summary
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while fetching and summarizing subtitles." });
  }
}

module.exports = fetchSubtitles;
