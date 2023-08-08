import React from 'react';
import { SummaryInput, BlockInput } from "../../components";

function Fire() {
  return (
    <div>
      <div id="content"></div>
      <SummaryInput />
      <hr />
      <BlockInput />
      <hr />
      <div id="blocks-display"></div>
    </div>
  );
}

export default Fire;
