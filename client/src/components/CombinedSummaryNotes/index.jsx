import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';
import TextEditor from '../../components/TextEditor';
import ExampleDocument from "../../utils/ExampleDocument";

function CombinedSummaryNotes() {
  const { documentId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const db = getFirestore(app);

  const updateSummaryBlock = (blockId, newText) => {
    // Get the Firestore reference to the specific document
    const summariesRef = db.collection('summaries').doc(documentId);
  
    // Create a path to the specific block you want to update
    const blockPath = `blocks.${blockId}.text`;
  
    // Update the text of the specific block
    summariesRef.update({
      [blockPath]: newText,
    }).catch(error => {
      console.error('Error updating block:', error);
    });
  };

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
  }, [documentId, db]);

  return (
    <div>
      <div id="blocks-display">
        {blocks.map((blockText, index) => (
          <div key={index}>
            {/* Pass the block text as a document to TextEditor */}
            <TextEditor 
              document={[{ type: "p", children: [{ text: blockText }] }]} 
              onChange={(newText) => updateSummaryBlock(`block${index + 1}`, newText)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CombinedSummaryNotes;
