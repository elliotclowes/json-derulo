const axios = require('axios');
const { summarizeTranscript } = require('./chatGPT'); // Assuming this is correctly imported
const admin = require('firebase-admin');
const db = admin.firestore();

async function fetchSubtitles(req, res) {
  const youtubeUrl = req.body.url;
  const user_id = req.body.user_id
  console.log(user_id,'fox')
  console.log(req.body, 'chicharon')
 // Extract user_id from the request body
  const timestamp = req.body.timestamp; // Extract timestamp from the request body
  const apiUrl = "http://178.128.39.115:8000/download_subtitles";
  
  try {
    const response = await axios.post(apiUrl, { url: youtubeUrl });
    const transcriptData = response.data; // Assuming this is the data received from the API
   
    const transcript = JSON.stringify(transcriptData);
    
    console.log(transcript);

    const prompt = "The following is a transcript from a YouTube video. I don't have time to watch it. So I need you to explain the video to me. Us your intuition and knowledge to decide how much text to return and how to format it. For example, for a recipe video you might give an overview, the needed ingredients and the steps to cook it. Or for a technical guide you might list of the command line instructions. Whenever you've gone to a new line I want you to put '/n' at the end of the previous one."

    const summary = await summarizeTranscript(prompt,  transcript); 
    const summaryRef = db.collection('summaries.fish').doc();
    await summaryRef.set({ 
      summary: summary,
      user_id: user_id, // Include the fetched user ID
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
