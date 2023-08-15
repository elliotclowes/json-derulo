const express = require('express');
require('dotenv').config();
const { uploadFile, transcribeAudio } = require('./assemblyAI');
const { summarizeTranscript } = require('./chatGPT');
const { db, bucket } = require('../database/firebase');
const pathModule = require('path');

const API_TOKEN = process.env.AAI_KEY;

async function processAudioUpload(audioBuffer, documentId, res) {
    try {
      const uploadUrl = await uploadFile(audioBuffer);
      const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
  
      // Use the transcript text directly as content for summarization
      const summary = await summarizeTranscript('Generate a summary of the transcript:', transcript.text);
  
      const transcriptInfo = "The transcript contains the sentence: " + transcript.text;
      console.log('Audio processing complete:', transcriptInfo);
  
      if (res) {
        res.status(200).json({ transcriptInfo, summary });
      }
  
      console.log('Summary:', summary);
      return summary; 
    } catch (error) {
      console.error('Error processing audio:', error);
  
      if (res) {
        res.status(500).send('Error processing audio');
      }
    }
  }
  
  module.exports = { processAudioUpload };
