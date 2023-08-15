require('dotenv').config();
const request = require('supertest');
const { processAudio } = require('../controllers/audioProcessing')
const app = require("../api")

const { uploadFile, transcribeAudio } = require('../controllers/assemblyAI');
const { summarizeTranscript } = require('../controllers/chatGPT');
const { db, bucket } = require('../database/firebase')
const pathModule = require('path');

const API_TOKEN = process.env.AAI_KEY;

jest.mock('../controllers/assemblyAI');
jest.mock('../controllers/chatGPT');
jest.mock('../database/firebase');


describe("processAudio function", () => {

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // should process audio
    test('should process audio', async () => {
        uploadFile.mockResolvedValue('test-upload-url')
        transcribeAudio.mockResolvedValue({ text: 'test transcript' })
        summarizeTranscript.mockResolvedValue('test summary')

        const docRef = { update: jest.fn(), get: jest.fn().mockResolvedValue({ data: () => ({ blockOrder: [], blocks: {} }) }) };
        db.collection.mockReturnValue({ doc: () => docRef });

        const file = { makePublic: jest.fn(), name: 'test-file-name' };
        bucket.upload.mockResolvedValue([file]);
        bucket.name = 'test-bucket-name';

        // Call the function
        processAudio('test-path');

        // Wait for a delay (adjust the delay as needed for your code)
        await delay(4900); // 5 second delay

        // Expectations
        expect(uploadFile).toHaveBeenCalledWith('test-path');
        expect(transcribeAudio).toHaveBeenCalledWith(API_TOKEN, 'test-upload-url');
        expect(bucket.upload).toHaveBeenCalledWith('test-path', { destination: 'audio/test-path' });
        expect(file.makePublic).toHaveBeenCalled();
        expect(docRef.update).toHaveBeenCalled();
  });

    })
