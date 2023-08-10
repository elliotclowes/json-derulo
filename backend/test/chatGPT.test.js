const request = require('supertest');
const { summarizeTranscript } = require('../controllers/chatGPT')
const app = require("../api")


describe("ChatGPT Functions", () => {

    // Test that summarizeTranscript returns text
    test('summarizeTranscript should return summary', async () => {
        const transcript = "This is a transcript test. What would normally go here is a transcript."
        const summaryResponse = await summarizeTranscript(transcript)
        expect(summaryResponse).toBeTruthy()
    })

    // Make sure long transcripts are shortened before being sent to ChatGPT
    test('make sure long transcripts are shortened before being sent to ChatGPTy', async () => {
        const transcript = "A".repeat(15000)
        const summaryResponse = await summarizeTranscript(transcript)
        expect(summaryResponse).toBeTruthy()
    })

})
