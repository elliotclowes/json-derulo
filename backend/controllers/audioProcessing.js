require('dotenv').config();
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');
const { db, bucket } = require('../database/firebase')
const pathModule = require('path');



const API_TOKEN = process.env.AAI_KEY;



// OLD: HZpgoFnM6Ht4M16YuTWk

async function processAudio(path, documentId) {
  console.log("🚀 ~ file: audioProcessing.js:12 ~ processAudio ~ path:", path)
  try {
    const uploadUrl = await uploadFile(path);
    const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
    const text = 'I want you to create a summary of the contents of the following transcript' + transcript.text;

    const filename = pathModule.basename(path);
    const destination = `audio/${filename}`; // Set the destination path in the bucket
    const [file] = await bucket.upload(path, { destination });

    // Make the file publicly accessible. TODO: NEEDS TO BE MADE ONLY VIEWABLE BY THE USER AT SOME POINT
    await file.makePublic();
    
    // Get the public URL of the file
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`; // Construct the public URL

    summarizeTranscript(text).then(async (summary) => {
      console.log('Audio processing complete:', summary);
    
      // Get the document reference
      const docRef = db.collection('summaries').doc(documentId);
    
      // Get the current data
      const doc = await docRef.get();
      const data = doc.data();
    
      // Generate new block ID
      const newBlockId = `block${data.blockOrder.length + 1}`;
    
      // Add the new block ID to the block order
      data.blockOrder.push(newBlockId);
    
      // Add the new block with the summary text
      data.blocks[newBlockId] = {
        text: [
          {
            type: "p",
            children: [{ text: summary }]
          }
        ],
        audioURL: publicUrl,
        comments: [] // Initialize with empty comments 
      };
    
      // Update the document with the new data
      await docRef.update(data);


    }).catch(error => {
      console.error('Error summarizing transcript:', error);
    });

  } catch (error) {
    console.error('Error processing audio:', error);
  }
}
module.exports = { processAudio };
