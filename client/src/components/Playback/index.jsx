import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid';

export default function Playback({ documentId, blockId }) {
  const [audioUrl, setAudioUrl] = useState('');  
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipText = isMuted ? "Play summary audio " : "Stop summary audio";

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
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                data-tooltip-target="tooltip-animation"
                type="button"
                className="rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleButtonClick}
            >
                {isMuted ? <SpeakerWaveIcon className="h-5 w-5" aria-hidden="true" /> : <SpeakerXMarkIcon className="h-5 w-5" aria-hidden="true" />}
            </button>
            {showTooltip && (
                <div
                    id="tooltip-animation"
                    role="tooltip"
                    className="absolute z-10 inline-block w-48 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700 flex items-center justify-center" // Center the content with flex
                    style={{ bottom: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' }}

                >
                    <span>{tooltipText}</span> {/* Enclosed the text in a <span> for clearer structure */}
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
            )}
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
