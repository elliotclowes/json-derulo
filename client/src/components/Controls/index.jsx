import React from 'react';

const Controls = ({ handlers }) => (
  <section className="experiment" style={{ padding: '5px' }}>
    <label htmlFor="time-interval">Time Interval (milliseconds):</label>
    <input type="text" id="time-interval" value="5000" />ms

    <br />

    <input id="left-channel" type="checkbox" checked style={{ width: 'auto' }} />

    <br />
    <br />

    <button id="start-recording" onClick={handlers.startRecording}>Start</button>
    <button id="stop-recording" disabled onClick={handlers.stopRecording}>Stop</button>

    <button id="pause-recording" disabled onClick={handlers.pauseRecording}>Pause</button>
    <button id="resume-recording" disabled onClick={handlers.resumeRecording}>Resume</button>

    <button id="save-recording" disabled onClick={handlers.saveRecording}>Save</button>
  </section>
);

export default Controls;
