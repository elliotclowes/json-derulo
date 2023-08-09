import React, { useEffect, useState } from 'react';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';

function BlocksDisplay({ documentId }) {
  const [blocks, setBlocks] = useState([]);
  const db = getFirestore(app);


  useEffect(() => {
    const summariesCollection = collection(db, 'summaries');
    const docRef = doc(summariesCollection, documentId);

    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const blocksArray = data.blockOrder.map(blockId => data.blocks[blockId].text);
        setBlocks(blocksArray);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, [documentId, db]); // Include db in dependencies

  return (
    <div id="blocks-display">
      {blocks.map((blockText, index) => <div key={index}>{blockText}</div>)}
    </div>
  );
}

export default BlocksDisplay;
