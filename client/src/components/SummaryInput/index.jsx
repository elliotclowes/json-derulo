import React from 'react';

function SummaryInput({ documentId }) {
  const updateSummary = () => {
    const db = firebase.firestore();
    const summaries = db.collection('summaries').doc(documentId);
    const summaryInput = document.getElementById('summary-input');
    summaries.update({ content: summaryInput.value });
  };

  return (
    <div>
      <label htmlFor="summary-input">Update summary:</label>
      <input type="text" id="summary-input" />
      <button onClick={updateSummary}>Update</button>
    </div>
  );
}

export default SummaryInput;
