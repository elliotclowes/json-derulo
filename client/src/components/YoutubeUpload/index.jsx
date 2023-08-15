import React, { useState } from 'react';
import { generateLearningSuggestions } from ''; 

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [subtitles, setSubtitles] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');

  const handleProcessVideo = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:3000/video/fetch_subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: youtubeUrl })
      });

      const data = await response.json();
      console.log(data);

      setSubtitles(data.summary);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing video:', error);
      setIsLoading(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    try {
      setIsLoading(true);


      const suggestionsText = await generateLearningSuggestions(subtitles);

      setSuggestions(suggestionsText);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      {isLoading && (
        <div className="loading-overlay" id="loadingOverlay">
          <div className="loading-icon"></div>
        </div>
      )}

      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Enter YouTube URL"
      />
      <button className="loadButton" onClick={handleProcessVideo}>
        Process Video
      </button>

      <div
        id="content"
        className={isLoading ? 'hidden' : ''}
      >
        <p>This is the content that gets loaded.</p>
      </div>

      {subtitles && (
        <div>
          {subtitles}
          <button onClick={handleGenerateSuggestions}>Generate Suggestions</button>
        </div>
      )}

      {suggestions && (
        <div>
          <h2>Suggestions:</h2>
          <p>{suggestions}</p>
        </div>
      )}
    </div>
  );
}

export default App;