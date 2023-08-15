import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';
import TextEditor from '../../components/TextEditor';

function CombinedSummaryNotes() {
  const { documentId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const db = getFirestore(app);
  const [isLoading, setIsLoading] = useState(false);
  const [nextSteps, setNextSteps] = useState([]);

  const updateSummaryBlock = async (blockId, newText) => {
    const summariesCollection = collection(db, 'summaries');
    const summariesRef = doc(summariesCollection, documentId);
    const blockPath = `blocks.${blockId}.text`;
    const updateObject = {
      [blockPath]: newText,
    };
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

  const handleLearnMore = async () => {
    try {
      setIsLoading(true);
      const prompt = "Please provide 3 bullet points on what to learn next and make them 1-4 word each :";
      const combinedText = blocks.join(' ');
      const response = await fetch('http://localhost:3000/audio/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          content: combinedText
        })
      });

      if (!response.ok) {
        throw new Error('Error fetching next steps');
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (data && data.nextSteps) {
          setNextSteps(data.nextSteps);
        } else {
          throw new Error('Invalid JSON response');
        }
      } else {
        const plainTextResponse = await response.text();
        const sentences = plainTextResponse.split('. '); 
        setNextSteps(sentences);
      }

    } catch (error) {
      console.error('Error fetching next steps:', error);
    } finally {
      setIsLoading(false);
    }
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

      <button className="learnMoreButton" onClick={handleLearnMore} disabled={isLoading}>
        Learn More
      </button>

      <div className="nextSteps">
        {nextSteps.length > 0 && (
          <div>
            <h2>What to Learn Next:</h2>
            <ul>
              {nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CombinedSummaryNotes;