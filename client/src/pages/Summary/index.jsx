import React from 'react';
import { Controls, AudioContainer } from "../../components";


// Your audio handling logic will be here
const handlers = {
  startRecording: () => {},
  stopRecording: () => {},
  pauseRecording: () => {},
  resumeRecording: () => {},
  saveRecording: () => {},
};

const Summary = () => (
  <html lang="en">
    <body>
      <article>
        <Controls handlers={handlers} />
        <AudioContainer />
      </article>
    </body>
  </html>
);

export default Summary;
