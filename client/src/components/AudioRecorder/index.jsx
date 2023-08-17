import React, { useState, useEffect, useRef } from 'react';
import Controls from '../Controls';
import AudioContainer from '../AudioContainer';

const AudioRecorder = ({ documentId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextSteps, setNextSteps] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [audiosContainer, setAudiosContainer] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [stopRecordingCount, setStopRecordingCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);



  const captureUserMedia = (mediaConstraints, successCallback, errorCallback) => {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
  };

  const indexRef = useRef(1); // Use a ref to store the index

  const onMediaSuccess = (stream) => {
    const newMediaRecorder = new MediaStreamRecorder(stream);
    newMediaRecorder.stream = stream;
    newMediaRecorder.recorderType = MediaRecorderWrapper;
    newMediaRecorder.audioChannels = !!document.getElementById('left-channel').checked ? 1 : 2;
  
    newMediaRecorder.ondataavailable = function (blob) {
      indexRef.current += 1; // Increment the index using the ref
      uploadAudio(blob); // Upload the audio blob to the server
    };
  
    var timeInterval = document.querySelector('#time-interval').value;
    if (timeInterval) timeInterval = parseInt(timeInterval) * 1000; // Convert seconds to milliseconds
    else timeInterval = 5 * 1000; // Default value if not provided
  
    newMediaRecorder.start(timeInterval);
  
    setMediaRecorder(newMediaRecorder);
    setIsRecording(true);
    setIsPaused(false);
  };
  

  const onMediaError = (e) => {
    console.error('media error', e);
  };

  const bytesToSize = (bytes) => {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  };

  useEffect(() => {
    setAudiosContainer(document.getElementById('audios-container'));
  }, []);


  const generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  };

  
  const uploadAudio = (blob) => {
    const randomFileName = generateRandomString(20) + '.wav';
    const formData = new FormData();
    formData.append('audio', blob, `part${indexRef.current}-` + randomFileName);
    formData.append('documentId', documentId); // Append the documentId to the request

    fetch('http://localhost:3000/audio/save', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => console.log('File uploaded successfully:', data))
    .catch(error => console.error('Error uploading file:', error));
  };
  
  

  const handlers = {
    startRecording: () => {
      captureUserMedia({ audio: true }, onMediaSuccess, onMediaError);
    },
    stopRecording: () => {
      mediaRecorder.stop();
      mediaRecorder.stream.stop();
      setIsRecording(false);
      setIsPaused(false);
      setStopRecordingCount(prevCount => prevCount + 1);
    },
    pauseRecording: () => {
      mediaRecorder.pause();
      setIsPaused(true);
    },
    resumeRecording: () => {
      mediaRecorder.resume();
      setIsPaused(false);
    },
    saveRecording: () => {
    mediaRecorder.stop();
      mediaRecorder.save();
    },
  };



  const handleLearnMore = async () => {
    try {
      setIsLoading(true);
      const prompt = "Please provide 3 bullet points on what to learn next and make them 1-4 word each :";
      const combinedText = blocks.join(' ');
      const response = await fetch('http://localhost:3000/audio/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          content: combinedText
        })
      });

      if (!response.ok) {
        throw new Error('Error fetching next steps');
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (data && data.nextSteps) {
          setNextSteps(data.nextSteps);
        } else {
          throw new Error('Invalid JSON response');
        }
      } else {
        const plainTextResponse = await response.text();
        const sentences = plainTextResponse.split('. '); 
        setNextSteps(sentences);
      }

    } catch (error) {
      console.error('Error fetching next steps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <Controls handlers={handlers} isRecording={isRecording} isPaused={isPaused} />
        <AudioContainer />
        <br></br>
      </div>
  
      {/* Conditionally render the "Learn this next..." section only when isRecording is false */}
      {stopRecordingCount > 0 && !isRecording && (
        <div className="bg-gray-100 py-24 sm:py-6 rounded-lg shadow">
          <div className="mx-auto max-w-7xl shadowpx-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <p className="mt-2 text-2xl font-bold tracking-tight text-blue-700 sm:text-3xl">
                Learn this next...
              </p>
              <p className="mt-6 text-m leading-8 text-gray-700">
                We'll use AI to analyse your summary and give<br></br> you some suggestions on what you should learn next!
              </p>
  
              <button 
                type="button" 
                className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4" 
                onClick={handleLearnMore} 
                disabled={isLoading}
              >
                Look into the future
              </button>
  
              <div className="nextSteps mt-4">
                {nextSteps.length > 0 && (
                  <div>
                    <h2>What to Learn Next:</h2>
                    <ul>
                      {nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
};

export default AudioRecorder;
