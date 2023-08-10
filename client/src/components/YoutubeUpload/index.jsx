import React, { useState } from 'react';

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [subtitles, setSubtitles] = useState(''); // State to hold subtitles

  const handleProcessVideo = async () => {
    try {
      const response = await fetch('http://localhost:3000/video/fetch_subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify({ url: youtubeUrl }) // Use "url" property
      });

      const data = await response.json();
      console.log(data);

      // Update subtitles state with the fetched data
      setSubtitles(data.subtitles);
    } catch (error) {
      console.error('Error processing video:', error);
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Enter YouTube URL"
      />
      <button onClick={handleProcessVideo}>Process Video</button>

      {/* Display subtitles below the button */}
      {subtitles && <div>{subtitles.summary}</div>}
    </div>
  );
}

export default App;
