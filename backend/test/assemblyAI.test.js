
const { uploadFile, transcribeAudio } = require('../controllers/assemblyAI')

const fs = require("fs")
const fetch = require("node-fetch");
const path = require("path")

jest.mock('fs')
jest.mock('node-fetch')



describe("AssemblyAI Functions", () => {

    // Should upload file
    test('Should upload file', async () => {
        // Mocking readFileSync to return a Buffer
        fs.readFileSync.mockReturnValue(Buffer.from('test data'))

        fetch.mockResolvedValue({
            status: 200,
            json: async () => ({ upload_url: 'test_upload_url' })
        })

        const filePath = path.join(__dirname, 'uploads/DO-NOT-DELETE.wav')
        const result = await uploadFile(filePath)

        expect(result).toEqual('test_upload_url')
    })


    // transcribeAudio function
    test('Should transcribe audio correctly', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ id: 'test_id' })
        })
        fetch.mockResolvedValueOnce({
            json: async () => ({ status: 'completed', text: 'transcribed text' })
        })

        const result = await transcribeAudio('test_api_token', 'test_audio_url')
        expect(result.text).toEqual('transcribed text')
    })

    // Should handle upload file error
    test('uploadFile should handle error', async () => {

        fs.readFileSync.mockReturnValue(Buffer.from('test data'));

        const errorMessage = 'Upload failed';
        const errorResponse = {
            response: {
                status: 500,
                statusText: 'Internal Server Error',
                data: errorMessage
            }
        };

        fetch.mockRejectedValue(errorResponse);

        const filePath = path.join(__dirname, 'uploads/DO-NOT-DELETE.wav');

        const result = await uploadFile(filePath);
        expect(result).toBeNull();
    });

    // Should handle transcription polling
    test('transcribeAudio should handle polling', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ id: 'test_id' }),
        });

        const pendingResponse = { status: 'pending' };
        const completedResponse = { status: 'completed', text: 'transcribed text' };
        fetch
            .mockResolvedValueOnce({
                json: async () => pendingResponse,
            })
            .mockResolvedValueOnce({
                json: async () => pendingResponse,
            })
            .mockResolvedValueOnce({
                json: async () => completedResponse,
            });

        const result = await transcribeAudio('test_api_token', 'test_audio_url');

        expect(result.text).toEqual('transcribed text');

        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
        expect(fetch).toHaveBeenCalledTimes(8);
    }, 20000);



})
