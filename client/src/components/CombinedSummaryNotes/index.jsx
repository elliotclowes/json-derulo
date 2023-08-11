import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';
import TextEditor from '../../components/TextEditor';

function CombinedSummaryNotes() {
  const { documentId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const db = getFirestore(app);

  const updateSummaryBlock = async (blockId, newText) => {
    // Get the Firestore reference to the specific document
    const summariesCollection = collection(db, 'summaries');
    const summariesRef = doc(summariesCollection, documentId);
  
    // Create a path to the specific block you want to update
    const blockPath = `blocks.${blockId}.text`;
  
    // Create an object representing the update
    const updateObject = {
      [blockPath]: newText,
    };
  
    // Update the text of the specific block
    await updateDoc(summariesRef, updateObject).catch(error => {
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

  const handleBlockSubmit = (blockId, newText) => {
    updateSummaryBlock(`block${blockId + 1}`, newText);
  };

  return (
    <div className="container mx-auto px-4">
      <div id="blocks-display" className="space-y-4">
        {blocks.map((blockText, index) => (
          <div key={index} className="border p-4 rounded">
            <TextEditor 
              document={blockText} 
              onChange={(newText) => updateSummaryBlock(`block${index + 1}`, newText)} 
              onSubmit={(newText) => handleBlockSubmit(index, newText)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CombinedSummaryNotes;
