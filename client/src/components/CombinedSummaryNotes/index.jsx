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
  
    // Update the text of the specific block
    const blockPath = `blocks.${blockId}.text.0.children.0.text`; // Update the path to reflect the text object
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
        const blocksArray = data.blockOrder.map(blockId => ({
          id: blockId,
          text: data.blocks[blockId].text,
        }));
        console.log('Blocks before update:', data.blocks);
        setBlocks(blocksArray);
        console.log('Blocks after update:', data.blocks);
      } else {
        console.log("No such document!");
      }
    });
    
    return () => unsubscribe();
  }, [documentId, db]);
  
  

  return (
    <div>
      <div id="blocks-display">
        {blocks.map((block) => (
          <div key={block.id}>
            <TextEditor
              document={block.text}
              onChange={(newText) =>
                updateSummaryBlock(block.id, newText[0].children[0].text) // pass the updated text
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default CombinedSummaryNotes;
