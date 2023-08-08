import React from 'react';

function BlockInput() {
  return (
    <div>
      <label htmlFor="title-input">Title:</label><br />
      <input type="text" id="title-input" /><br />

      <label htmlFor="content-input">Content:</label><br />
      <textarea id="content-input"></textarea><br />

      <label>Blocks:</label><br />
      <div id="blocks-container">
        <Block number={1} />
        <Block number={2} />
        <Block number={3} />
      </div>

      <button onClick={() => {/* submitSummary logic here */}}>Submit</button>
    </div>
  );
}

function Block({ number }) {
  return (
    <div className="block">
      <label htmlFor={`block${number}`}>Block {number}:</label><br />
      <input type="text" id={`block${number}`} className="block-input" /><br />
    </div>
  );
}

export default BlockInput;
