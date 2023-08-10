const axios = require('axios');

async function fetchSubtitles(req, res) {
  const youtubeUrl = req.body.url; 
  const apiUrl = "http://178.128.39.115:8000/download_subtitles"; 
  try {
    const response = await axios.post(apiUrl, { url: youtubeUrl }); 
    const subtitles = response.data;
    console.log(subtitles); 
    res.status(200).json(subtitles);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while fetching subtitles." });
  }
}

module.exports = fetchSubtitles;
