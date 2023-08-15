const request = require('supertest');
const axios = require('axios');
const admin = require('firebase-admin');
const { summarizeTranscript } = require('../controllers/chatGPT'); // Assuming this is the correct path
const app = require('../api');
const db = admin.firestore();

jest.mock('axios');

describe('Fetch Subtitles API', () => {
    // Mock axios response
    axios.post.mockResolvedValue({
        data: [
            { start: 0, end: 10, text: 'Subtitle 1' },
            { start: 15, end: 25, text: 'Subtitle 2' },
            // ... other subtitles ...
        ],
    });

    // Mock summarizeTranscript function
    jest.mock('../controllers/chatGPT', () => ({
        summarizeTranscript: jest.fn((content) => `Summary of ${content}`),
    }));

    // Test successful fetch and summarization
    test('should fetch subtitles, summarize, and store in Firebase', async () => {
        const mockRequest = {
            body: {
                url: 'https://www.example.com/youtube-video-url',
                user_id: 'user123', // Add a valid user ID
                timestamp: '1234567890', // Add a valid timestamp
            },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await request(app).post('/video/fetch_subtitles').send(mockRequest).expect(200);

        expect(axios.post).toHaveBeenCalledWith('http://178.128.39.115:8000/download_subtitles', {
            url: 'https://www.example.com/youtube-video-url',
        });

        expect(summarizeTranscript).toHaveBeenCalledWith(expect.any(String), expect.any(String));
        expect(db.collection().doc().set).toHaveBeenCalledWith({
            summary: 'Summary of Subtitle 1Subtitle 2', // Check if the summary matches your expectation
            user_id: 'user123',
            timestamp: '1234567890',
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            summary: 'Summary of Subtitle 1Subtitle 2', // Check if the summary matches your expectation
        });
    });

    // Test error handling
    test('should handle errors during fetch and summarization', async () => {
        axios.post.mockRejectedValue(new Error('Fetch error'));
        const mockRequest = {
            body: {
                url: 'https://www.example.com/youtube-video-url',
            },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await request(app)
            .post('/video/fetch_subtitles')
            .send(mockRequest)
            .expect(500, { error: 'An error occurred while fetching and summarizing subtitles.' });

        expect(axios.post).toHaveBeenCalledWith('http://178.128.39.115:8000/download_subtitles', {
            url: 'https://www.example.com/youtube-video-url',
        });

        expect(summarizeTranscript).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'An error occurred while fetching and summarizing subtitles.',
        });
    });
});
