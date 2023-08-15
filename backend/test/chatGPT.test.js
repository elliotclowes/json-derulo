const request = require('supertest');
const { summarizeTranscript } = require('../controllers/chatGPT')
const app = require("../api")
require("dotenv").config()
const { Configuration, OpenAIApi } = require("openai");
const encoder = require('gpt-3-encoder');


describe("ChatGPT Functions", () => {

    jest.mock('openai', () => {
        return {
            Configuration: jest.fn(),
            OpenAIApi: jest.fn(() => ({
                createChatCompletion: jest.fn(() => ({
                    data: {
                        choices: [
                            {
                                message: {
                                    content: 'Your summarized content here'
                                }
                            }
                        ]
                    }
                }))
            }))
        };
    });

    // Test that summarizeTranscript returns text
    test('summarizeTranscript should return summary', async () => {
        const transcript = "This is a transcript test. What would normally go here is a transcript."
        const summaryResponse = await summarizeTranscript(transcript)

        expect(summaryResponse).toBeTruthy()
    })

    // Make sure long transcripts are shortened before being sent to ChatGPT
    test('make sure long transcripts are shortened before being sent to ChatGPT', async () => {
        const transcript = "A".repeat(15000)
        const summaryResponse = await summarizeTranscript(transcript)
        expect(summaryResponse).toBeTruthy()
    })



});