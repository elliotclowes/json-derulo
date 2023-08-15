const Controls = ({ handlers, isRecording }) => (
  <section className="experiment py-5">
    <label htmlFor="time-interval" style={{ display: 'none' }} >Time Interval (seconds):</label>
    <input type="text" id="time-interval" defaultValue="120" className="border p-2 my-2 rounded" style={{ display: 'none' }}  />

    <input id="left-channel" type="checkbox" defaultChecked style={{ display: 'none' }} />
    <button
        type="button"
        onClick={handlers.startRecording}
        disabled={isRecording}
        className={`rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 mr-2 ${isRecording ? 'bg-green-300' : 'bg-green-600'}`}
      >
        {isRecording ? 'Recording...' : 'Start'}
      </button>
    <button
        type="button"
        onClick={handlers.stopRecording}
        disabled={!isRecording}
        className={`rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 ${isRecording ? 'bg-red-600' : 'bg-gray-300'}`}
      >
        Stop
      </button>
  </section>
);

export default Controls;
