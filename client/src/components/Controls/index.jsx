const Controls = ({ handlers, isRecording /* , isPaused Remove this part */ }) => (
  <section className="experiment py-5">
    <label htmlFor="time-interval">Time Interval (seconds):</label>
    <input type="text" id="time-interval" defaultValue="60" className="border p-2 my-2 rounded" />

    <br />

    <input id="left-channel" type="checkbox" defaultChecked style={{ width: 'auto' }} />

    <br />
    <br />

    <button id="start-recording" onClick={handlers.startRecording} disabled={isRecording} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Start</button>
    <button id="stop-recording" onClick={handlers.stopRecording} disabled={!isRecording} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Stop</button>
  </section>
);

export default Controls;
