import React from 'react';

function BlockInput({ documentId }) {
  const submitSummary = () => {
    const db = firebase.firestore();
    
    // Get data from form
    const title = document.getElementById('title-input').value;
    const content = document.getElementById('content-input').value;
    const blockInputs = Array.from(document.getElementsByClassName('block-input'));
    
    // Build blockOrder and blocks
    const blockOrder = [];
    const blocks = {};
    
    blockInputs.forEach((blockInput, index) => {
      const blockId = `block${index + 1}`;
      blockOrder.push(blockId);
      blocks[blockId] = { text: blockInput.value, comments: [] };
    });
    
    // Build data object
    const data = {
      title,
      content,
      blockOrder,
      blocks
    };
    
    // Write new document to 'summaries' collection
    db.collection('summaries').doc(documentId).set(data)
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

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

      <button onClick={submitSummary}>Submit</button>
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
