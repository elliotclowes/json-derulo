import React, { useState } from 'react';
import { generateLearningSuggestions } from ''; 


function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [subtitles, setSubtitles] = useState('');
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');

  const handleProcessVideo = async () => {
    try {
      setIsLoading(true);

=======
  const [isLoading, setIsLoading] = useState(false);  
  
  const currentDate = new Date();
const formattedDate = currentDate.toISOString();

  const handleProcessVideo = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting to fetch subtitles
      const getuserID = async () => {
        const token =localStorage.getItem('token');
        if(!token) return null;
        const response = await fetch (`http://localhost:3000/token/get/${token}`);
        const data = await response.json();
        console.log(data, 'fish')
        return data.user_id.toString()
      };
      console.log( await getuserID(),'hello')
      const user_id = await getuserID(); // Fetch the user ID
      if (!user_id) {
        console.error("Failed to fetch user ID.");
        setIsLoading(false); // Set loading to false in case of an error
        return;
      }
>>>>>>> a7af73ea3a56990d22df17345436d9557b8d36e5
      const response = await fetch('http://localhost:3000/video/fetch_subtitles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: youtubeUrl,
        user_id: user_id,
        timestamp: formattedDate
      })
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