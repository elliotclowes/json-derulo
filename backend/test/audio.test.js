const { saveAudio } = require('../controllers/audio')
const fs = require('fs');
const { processAudio } = require('../controllers/audioProcessing');
const { response } = require('express');

jest.mock('fs');
jest.mock('gpt-3-encoder', () => ({
    encode: jest.fn()
  }));
jest.mock('../controllers/audioProcessing');

describe('saveAudio function', () => {
  it('should respond with a success message when the audio file is saved', async () => {
    // Mocking fs.rename to simulate successful file renaming
    fs.rename.mockImplementation((_, __, callback) => callback(null));

    // Mocking processAudio function
    processAudio.mockImplementation(() => Promise.resolve());

    const req = {
      file: { originalname: 'test.wav', path: 'test_path' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await saveAudio(req, res);

    expect(res.send).toHaveBeenCalledWith('File uploaded and saved.');
  });

  it('should respond with an error message if renaming the file fails', async () => {
    // Mocking fs.rename to simulate an error during file renaming
    fs.rename.mockImplementation((_, __, callback) => callback(new Error('rename error')));

    const req = {
      file: { originalname: 'test.wav', path: 'test_path' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await saveAudio(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error saving audio file: Error: rename error');
  });


});
