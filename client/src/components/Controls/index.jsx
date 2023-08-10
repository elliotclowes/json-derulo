import React from 'react';

const Controls = ({ handlers, isRecording, isPaused }) => (
  <section className="experiment" style={{ padding: '5px' }}>
    <label htmlFor="time-interval">Time Interval (seconds):</label>
    <input type="text" id="time-interval" defaultValue="60" />

    <br />

    <input id="left-channel" type="checkbox" defaultChecked style={{ width: 'auto' }} />

    <br />
    <br />

    <button id="start-recording" onClick={handlers.startRecording} disabled={isRecording}>Start</button>
    <button id="stop-recording" onClick={handlers.stopRecording} disabled={!isRecording}>Stop</button>
    <button id="pause-recording" onClick={handlers.pauseRecording} disabled={!isRecording || isPaused}>Pause</button>
    <button id="resume-recording" onClick={handlers.resumeRecording} disabled={!isRecording || !isPaused}>Resume</button>
    <button id="save-recording" onClick={handlers.saveRecording} disabled={!isRecording}>Save</button>
  </section>
);

export default Controls;
