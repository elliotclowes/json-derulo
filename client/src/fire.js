document.addEventListener('DOMContentLoaded', event => {
    const app = firebase.app();
    const db = firebase.firestore();
  
    const summaries = db.collection('summaries').doc('m6T8xUkMmUUH0aAaanks');
  
    // Ensure the element you want to update exists in your HTML
    const contentElement = document.getElementById('content');
  
    summaries.onSnapshot(doc => {
      const data = doc.data();
      if (contentElement) {
        contentElement.innerHTML = data.content;
      }
    });
  
    // Call displayBlocks() function when index.html loads
    const documentId = 'HZpgoFnM6Ht4M16YuTWk';
    displayBlocks(documentId);
  });

function updateSummary() {
    const db = firebase.firestore();
    const summaries = db.collection('summaries').doc('m6T8xUkMmUUH0aAaanks');
    const summaryInput = document.getElementById('summary-input');
    summaries.update({ content: summaryInput.value })
}


function submitSummary() {
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
    db.collection('summaries').add(data)
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }



let documentId = 'HZpgoFnM6Ht4M16YuTWk';

function displayBlocks(documentId) {
    const db = firebase.firestore();
    const docRef = db.collection('summaries').doc(documentId);
  
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const blocks = data.blocks;
        const blocksDisplay = document.getElementById('blocks-display');
        blocksDisplay.innerHTML = '';
  
        data.blockOrder.forEach(blockId => {
          const block = blocks[blockId];
          const blockDiv = document.createElement('div');
          blockDiv.textContent = block.text;
          blocksDisplay.appendChild(blockDiv);
        });
      } else {
        console.log("No such document!");
      }
    });
  }
