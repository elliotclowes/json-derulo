import React, { useState, useEffect } from 'react';
import Controls from '../Controls';
import AudioContainer from '../AudioContainer';

const AudioRecorder = () => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [index, setIndex] = useState(1);
    const [audiosContainer, setAudiosContainer] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

  const captureUserMedia = (mediaConstraints, successCallback, errorCallback) => {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
  };

  const onMediaSuccess = (stream) => {
                    var audio = document.createElement('audio');
                    audio.controls = true;
                    audio.muted = true;
                    audio.srcObject = stream;
                    audio.play();

                    audiosContainer.appendChild(audio);
                    audiosContainer.appendChild(document.createElement('hr'));

                    const newMediaRecorder = new MediaStreamRecorder(stream);
                    newMediaRecorder.stream = stream;
                    newMediaRecorder.recorderType = MediaRecorderWrapper;
                    newMediaRecorder.audioChannels = !!document.getElementById('left-channel').checked ? 1 : 2;

                    newMediaRecorder.ondataavailable = function (blob) {
                    var a = document.createElement('a');
                    a.target = '_blank';
                    a.innerHTML = 'Audio file ' + index + ' (Size: ' + bytesToSize(blob.size) + ')';
                    a.href = URL.createObjectURL(blob);
                    audiosContainer.appendChild(a);
                    audiosContainer.appendChild(document.createElement('hr'));
                    setIndex(index + 1); // Update the index using the setter
                  };

                  var timeInterval = document.querySelector('#time-interval').value;
                  if (timeInterval) timeInterval = parseInt(timeInterval);
                  else timeInterval = 5 * 1000;
              
                  newMediaRecorder.start(timeInterval);
              
                  setMediaRecorder(newMediaRecorder);
                  setIsRecording(true); // Set recording state
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

  const handlers = {
    startRecording: () => {
        captureUserMedia({ audio: true }, onMediaSuccess, onMediaError);
      },
    stopRecording: () => {
        mediaRecorder.stop();
        mediaRecorder.stream.stop();
        setIsRecording(false); // Reset recording state
    },
    pauseRecording: () => {
      mediaRecorder.pause();
    },
    resumeRecording: () => {
      mediaRecorder.resume();
    },
    saveRecording: () => {
      mediaRecorder.save();
    },
  };

  return (
    <div>
      <Controls handlers={handlers} isRecording={isRecording} />
      <AudioContainer />
    </div>
  );
};

export default AudioRecorder;
