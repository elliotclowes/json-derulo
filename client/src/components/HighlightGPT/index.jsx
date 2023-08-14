import React, { useState } from 'react';

export default function HighlightGPT ({ text, onWordHover, onWordClick }){
    const words = text.split(' ');
    const [highlightedWord, setHighlightedWord] = useState('');
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  
    const handleHover = (word, event) => {
      setHighlightedWord(word);
      onWordHover(word);
  
      // Calculate button position
      const rect = event.target.getBoundingClientRect();
      setButtonPosition({ top: rect.top, left: rect.right });
    };
  
    const handleClick = (word) => {
      if (highlightedWord === word) {
        setHighlightedWord('');
        onWordClick('');
      } else {
        setHighlightedWord(word);
        onWordClick(word);
      }
    };
  
    const handleButtonHover = () => {
      if (highlightedWord) {
        // Calculate button position when hovering the button
        const rect = document.querySelector(`.highlightable[data-word="${highlightedWord}"]`).getBoundingClientRect();
        setButtonPosition({ top: rect.top, left: rect.right });
      }
    };
  
    return (
      <p>
        {words.map((word, index) => (
          <span
            key={index}
            className={`highlightable ${word === highlightedWord ? 'highlighted' : ''}`}
            data-word={word}
            onMouseEnter={(e) => handleHover(word, e)}
            onMouseLeave={() => setHighlightedWord('')}
            onClick={() => handleClick(word)}
          >
            {word}{' '}
          </span>
        ))}
        {highlightedWord && (
          <button
            className="follow-button"
            style={{ top: buttonPosition.top, left: buttonPosition.left }}
            onMouseEnter={handleButtonHover}
            onClick={() => handleClick(highlightedWord)}
          >
            Get Info
          </button>
        )}
      </p>
    );
  };


  