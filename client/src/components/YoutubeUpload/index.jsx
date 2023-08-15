import React, { useState } from 'react';

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [subtitles, setSubtitles] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nextSteps, setNextSteps] = useState([]);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();

  const handleProcessVideo = async () => {
    try {
      setIsLoading(true);

      const getuserID = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const response = await fetch(`http://localhost:3000/token/get/${token}`);
        const data = await response.json();
        return data.user_id.toString();
      };
      const user_id = await getuserID();
      if (!user_id) {
        console.error("Failed to fetch user ID.");
        setIsLoading(false);
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
      setSubtitles(data.summary);
      setIsLoading(false);

    } catch (error) {
      console.error('Error processing video:', error);
      setIsLoading(false);
    }
  };

  const handleLearnMore = async () => {
    try {
      setIsLoading(true);
  
      const prompt = "Please provide 3 bullet points on what to learn next and make them 1-4 word each :";
  
      const response = await fetch('http://localhost:3000/audio/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          content: subtitles
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

      <div id="content" className={isLoading ? 'hidden' : ''}>
        <p>This is the content that gets loaded.</p>
      </div>

      {subtitles && <div>{subtitles}</div>}

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

export default App;