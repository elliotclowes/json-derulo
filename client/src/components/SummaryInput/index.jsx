import React from 'react';

function SummaryInput() {
  return (
    <div>
      <label htmlFor="summary-input">Update summary:</label>
      <input type="text" id="summary-input" />
      <button onClick={() => {/* updateSummary logic here */}}>Update</button>
    </div>
  );
}

export default SummaryInput;
