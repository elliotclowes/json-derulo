import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid';

export default function Playback({ documentId, blockId }) {
  const [audioUrl, setAudioUrl] = useState('');  
  const [isMuted, setIsMuted] = useState(true);  // Initialize as true since audio isn't playing initially
  const audioRef = useRef(null);  // Create a ref for the audio element

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

  return (
    <>
      <button
        type="button"
        className="rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleButtonClick}
      >
        {isMuted ? <SpeakerWaveIcon className="h-5 w-5" aria-hidden="true" /> : <SpeakerXMarkIcon className="h-5 w-5" aria-hidden="true" />}
      </button>

      <audio ref={audioRef} className="hidden" key={audioUrl}>  {/* Remove the autoPlay attribute */}
        <source src={audioUrl} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </>
  )
}
