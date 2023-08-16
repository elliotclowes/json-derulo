import React, { useState } from 'react';


function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [subtitles, setSubtitles] = useState('');
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

      // Update subtitles state with the fetched data
      setSubtitles(data.summary); // Assuming data.summary is the correct property
      
      setIsLoading(false); // Set loading to false after fetching subtitles

    } catch (error) {
      console.error('Error processing video:', error);
      setIsLoading(false); // Make sure loading is set to false in case of an error
    }
  };

  return (
    <div className="App">
      {isLoading && (
        <div className="loading-overlay" id="loadingOverlay">
          <div className="loading-icon"></div>
        </div>
      )}

     
      <strong><button className="loadButton" onClick={handleProcessVideo}>
        Upload Video
      </button></strong>
      <br />
      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Enter YouTube URL"
      />
      <div
        id="content"
        className={isLoading ? 'hidden' : ''}
      >
        {/* Your content goes here */}
        <p>This is the content that gets loaded.</p>
      </div>

      {/* Display subtitles below the button */}
      {subtitles && <div>{subtitles}</div>}
    </div>
  );
}

export default App;
