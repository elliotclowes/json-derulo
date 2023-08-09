require('dotenv').config();
const fs = require("fs");
const fetch = require("node-fetch");

const API_TOKEN = process.env.AAI_KEY;

async function uploadFile(path) {
    console.log(`Uploading file: ${path}`);

    // Read the file data
    const data = fs.readFileSync(path);
    const url = "https://api.assemblyai.com/v2/upload";
  
    try {
      // Send a POST request to the API to upload the file, passing in the headers and the file data
      const response = await fetch(url, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: API_TOKEN,
        },
      });
  
      // If the response is successful, return the upload URL
      if (response.status === 200) {
        const responseData = await response.json();
        return responseData["upload_url"];
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return null;
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  async function transcribeAudio(api_token, audio_url) {
    console.log("Transcribing audio at URL:", audio_url);
  
    // Set the headers for the request, including the API token and content type
    const headers = {
      authorization: API_TOKEN,
      "content-type": "application/json",
    };
  
    // Send a POST request to the transcription API with the audio URL in the request body
    const response = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      body: JSON.stringify({ audio_url }),
      headers,
    });
  
    // Retrieve the ID of the transcript from the response data
    const responseData = await response.json();
    const transcriptId = responseData.id;
  
    const pollingFunction = async (transcriptId) => {
      // Construct the polling endpoint URL using the transcript ID
      const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
  
      // Poll the transcription API until the transcript is ready
      let attempts = 0;
      const maxAttempts = 20; // This can be changed
      const pollingInterval = 3000; // 3 seconds, can be adjusted as well
  
      while (attempts < maxAttempts) {
        attempts++;
  
        const pollingResponse = await fetch(pollingEndpoint, { headers });
        const transcriptionResult = await pollingResponse.json();
  
        console.log("Polling response:", transcriptionResult); // Log the polling response to understand the status
  
        if (transcriptionResult.status === "completed") {
          console.log("Transcription completed:", transcriptionResult.text);
          return transcriptionResult;
        } else if (transcriptionResult.status === "failed") {
          throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        }
  
        // If still processing, wait for the specified interval before polling again
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
      }
  
      // If the loop exits without returning, it means the transcription was not completed in the given attempts
      throw new Error("Transcription did not complete in the expected time.");
    };
  
    return pollingFunction(transcriptId); // Calling the polling function with the transcript ID
  }
  
  module.exports = { uploadFile, transcribeAudio };
