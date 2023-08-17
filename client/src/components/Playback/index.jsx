import React, { useState, useEffect } from 'react';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';

export default function Playback({ documentId, blockId }) {
  const [audioUrl, setAudioUrl] = useState('');  // Use useState to keep track of the audio URL
  

  const db = getFirestore(app);

  useEffect(() => {
    const summariesCollection = collection(db, 'summaries');
    const docRef = doc(summariesCollection, documentId);

    // Set up the real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            if (data.blocks && data.blocks[blockId] && data.blocks[blockId].audioURL) {
                setAudioUrl(data.blocks[blockId].audioURL);  // Update state with the new audio URL
            }
        }
    });

    // Cleanup function
    return () => {
        unsubscribe();
    };

  }, [documentId, blockId]);

  
  console.log("🚀 ~ file: index.jsx:7 ~ Playback ~ audioUrl:", audioUrl)
  return (
    <>
      <audio className="w-64" controls autoPlay key={audioUrl}>
    <source src={audioUrl} type="audio/wav" />
    Your browser does not support the audio element.
</audio>

    </>
  )
}
