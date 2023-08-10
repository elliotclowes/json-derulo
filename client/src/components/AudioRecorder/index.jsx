import React, { useState, useEffect, useRef } from 'react';
import Controls from '../Controls';
import AudioContainer from '../AudioContainer';

const AudioRecorder = ({ documentId }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [audiosContainer, setAudiosContainer] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const captureUserMedia = (mediaConstraints, successCallback, errorCallback) => {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
  };

  const indexRef = useRef(1); // Use a ref to store the index

  // OLD VERSION WHICH SHOWS PLAYER AND FILES
  // const onMediaSuccess = (stream) => {
  //                   var audio = document.createElement('audio');
  //                   audio.controls = true;
  //                   audio.muted = true;
  //                   audio.srcObject = stream;
  //                   audio.play();

  //                   audiosContainer.appendChild(audio);
  //                   audiosContainer.appendChild(document.createElement('hr'));

  //                   const newMediaRecorder = new MediaStreamRecorder(stream);
  //                   newMediaRecorder.stream = stream;
  //                   newMediaRecorder.recorderType = MediaRecorderWrapper;
  //                   newMediaRecorder.audioChannels = !!document.getElementById('left-channel').checked ? 1 : 2;

  //                   newMediaRecorder.ondataavailable = function (blob) {
  //                       var a = document.createElement('a');
  //                       a.target = '_blank';
  //                       a.innerHTML = 'Audio file ' + indexRef.current + ' (Size: ' + bytesToSize(blob.size) + ')';
  //                       a.href = URL.createObjectURL(blob);
  //                       audiosContainer.appendChild(a);
  //                       audiosContainer.appendChild(document.createElement('hr'));
  //                       indexRef.current += 1; // Increment the index using the ref
                      
  //                       uploadAudio(blob); // Upload the audio blob to the server
  //                     };

  //   var timeInterval = document.querySelector('#time-interval').value;
  //   if (timeInterval) timeInterval = parseInt(timeInterval) * 1000; // Convert seconds to milliseconds
  //   else timeInterval = 5 * 1000; // Default value if not provided
    
  //   newMediaRecorder.start(timeInterval);
                      

  //   setMediaRecorder(newMediaRecorder);
  //   setIsRecording(true);
  //   setIsPaused(false);
  // };


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

    fetch('https://learnt-me.onrender.com/audio/save', {
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

  return (
    <div>
      <Controls handlers={handlers} isRecording={isRecording} isPaused={isPaused} />
      <AudioContainer />
    </div>
  );
};

export default AudioRecorder;
