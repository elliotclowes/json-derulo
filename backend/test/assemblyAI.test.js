
const { uploadFile, transcribeAudio } = require('../controllers/assemblyAI')

const fs = require("fs")
const fetch = require("node-fetch");
const path = require("path")

jest.mock('fs')
jest.mock('node-fetch')



describe("AssemblyAI Functions", () => {

    // Should upload file
    test('summarizeTranscript should return summary', async () => {
        // Mocking readFileSync to return a Buffer
        fs.readFileSync.mockReturnValue(Buffer.from('test data'))
        
        fetch.mockResolvedValue({
            status: 200,
            json: async () => ({ upload_url: 'test_upload_url'})
        })

        const filePath = path.join(__dirname, 'uploads/DO-NOT-DELETE.wav')
        const result = await uploadFile(filePath)

        expect(result).toEqual('test_upload_url')
    })


    // transcribeAudio function
    test('should transcribe audio correctly', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ id: 'test_id' })
        })
        fetch.mockResolvedValueOnce({
            json: async () => ({ status: 'completed', text: 'transcribed text' })
        })

        const result = await transcribeAudio('test_api_token', 'test_audio_url')
        expect(result.text).toEqual('transcribed text')
    })


})
