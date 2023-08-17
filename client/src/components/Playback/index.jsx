import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';

export default function Playback({ documentId, blockId }) {
  const [audioUrl, setAudioUrl] = useState('');  
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const db = getFirestore(app);

  useEffect(() => {
    const summariesCollection = collection(db, 'summaries');
    const docRef = doc(summariesCollection, documentId);

    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            if (data.blocks && data.blocks[blockId] && data.blocks[blockId].audioURL) {
                setAudioUrl(data.blocks[blockId].audioURL);
            }
        }
    });

    return () => {
        unsubscribe();
    };

  }, [documentId, blockId]);

  const handleButtonClick = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  }

  const handleAudioEnded = () => {
    setIsMuted(true);
  }

  if (blockId === 'block1') {
    return null; // Don't render anything
  }

  return (
    <>
        <div className="relative inline-block">
            <button
                type="button"
                className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                onClick={handleButtonClick}
            >
                {isMuted ? "Play Audio" : "Stop Audio"}
            </button>
        </div>

        <audio 
            ref={audioRef} 
            className="hidden" 
            key={audioUrl} 
            onEnded={handleAudioEnded}
        >
            <source src={audioUrl} type="audio/wav" />
        </audio>
    </>
  )
}
