import React from 'react';

const Controls = ({ handlers, isRecording, isPaused }) => (
  <section className="experiment py-5">
    <label htmlFor="time-interval">Time Interval (seconds):</label>
    <input type="text" id="time-interval" defaultValue="60" className="border p-2 my-2 rounded" />

    <br />

    <input id="left-channel" type="checkbox" defaultChecked style={{ width: 'auto' }} />

    <br />
    <br />

    <button id="start-recording" onClick={handlers.startRecording} disabled={isRecording} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Start</button>
    <button id="stop-recording" onClick={handlers.stopRecording} disabled={!isRecording} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Stop</button>
    <button id="pause-recording" onClick={handlers.pauseRecording} disabled={!isRecording || isPaused} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Pause</button>
    <button id="resume-recording" onClick={handlers.resumeRecording} disabled={!isRecording || !isPaused} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Resume</button>
    <button id="save-recording" onClick={handlers.saveRecording} disabled={!isRecording} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Save</button>
  </section>
);

export default Controls;
