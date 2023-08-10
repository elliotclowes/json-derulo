import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js'; // Update the import path accordingly
import TextEditor from '../../components/TextEditor';

function CombinedSummaryNotes() {
  const { documentId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const db = getFirestore(app);

  const updateSummaryBlock = async (blockId, newText) => {
    try {
      // Get the Firestore reference to the specific document
      const summariesRef = db.collection('summaries').doc(documentId);
    
      // Define the path to the specific block text
      const blockPath = `blocks.${blockId}.text[0].children[0].text`;
    
      // Update only the specific text of the block
      await summariesRef.update({ [blockPath]: newText });
    
      console.log('Firebase document updated:', blockId, newText);
    } catch (error) {
      console.error('Error updating block:', error);
    }
  };
  
  
  // Create a function to update a specific block
  const updateBlockText = (index, newText) => {
    console.log('Updating blocktext:', index, newText);
    const updatedBlocks = [...blocks];
    updatedBlocks[index].text[0].children[0].text = newText; // Update the local state
    setBlocks(updatedBlocks);
    console.log("🚀 ~ file: index.jsx:34 ~ updateBlockText ~ setBlocks:", setBlocks)
    
    const blockId = `block${index + 1}`;
    updateSummaryBlock(blockId, [{ text: newText }]); // Update Firebase
  };

  useEffect(() => {
    const docRef = doc(db, 'summaries', documentId);
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log('Data from Firebase:', data);
  
        // Use blockOrder to generate the blocksArray by keeping the whole block structure
        const blocksArray = data.blockOrder.map(blockId => data.blocks[blockId]);
  
        // Update the state with the new blocksArray
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
        {blocks.map((block, index) => (
          <div key={index}>
            <TextEditor document={block.text} onChange={(newText) => updateBlockText(index, newText)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CombinedSummaryNotes;
