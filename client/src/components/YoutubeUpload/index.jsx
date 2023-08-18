import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../../firebase-config'; 
import { CloudArrowDownIcon, VideoCameraIcon } from '@heroicons/react/20/solid'

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [subtitles, setSubtitles] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nextSteps, setNextSteps] = useState([]);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();

  const [hasGPTResponse, setHasGPTResponse] = useState(false);


  const handleProcessVideo = async () => {
    try {
      setIsLoading(true);

      const getuserID = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const response = await fetch(`https://learnt-me.onrender.com/token/get/${token}`);
        const data = await response.json();
        return data.user_id.toString();
      };
      const user_id = await getuserID();
      if (!user_id) {
        console.error('Failed to fetch user ID.');
        setIsLoading(false);
        return;
      }

      let requestData = {
        url: youtubeUrl,
        user_id: user_id,
        timestamp: formattedDate,
      };

      if (typeof requestData === 'object') {
        requestData = JSON.stringify(requestData);
      }

      const response = await fetch('https://learnt-me.onrender.com/video/fetch_subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData,
      });

      const data = await response.json();
      const formattedSummary = formatResponse(data.summary);
      setSubtitles(formattedSummary);
      setIsLoading(false);

      // Store the data in Firestore
      const firestore = getFirestore(app);
      await addDoc(collection(firestore, 'Media-Summaries'), {
        content: data.summary,
        userID: user_id,
        timestamp: formattedDate,
        type: 'video',
      });

    } catch (error) {
      console.error('Error processing video:', error);
      setIsLoading(false);
    }
  };

  const handleLearnMore = async () => {
    try {
      setIsLoading(true);
  
      const prompt = "The following is a transcript from a YouTube video. I don't have time to watch it. So I need you to explain the video to me. Us your intuition and knowledge to decide how much text to return and how to format it. For example, for a recipe video you might give an overview, the needed ingredients and the steps to cook it. Or for a technical guide you might list of the command line instructions. Go into as much detail as possible.";
  
      const response = await fetch('https://learnt-me.onrender.com/audio/chatgpt', {
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
          setHasGPTResponse(true);
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

  const formatResponse = (response) => {
    return response.split('\n').map(line => 
      `<p className="text-gray-700">${line}</p>`
    ).join('<br/>');
};

  return (
    <div className="mx-auto max-w-2xl px-6 py-6 bg-white shadow sm:rounded-lg lg:px-8">

    <div className="border-b border-gray-200 pb-5">
      <h3 className="text-2xl font-semibold leading-7 text-gray-900">AI-generated video summaries</h3>
      <p className="mt-2 max-w-4xl text-lg text-gray-500">
        Submit the URL of a YouTube video below and we'll summarize it for you. Want a recipe without watching a long video? Need instructions from a technical video? This is the place to get that in seconds.
      </p>
    </div>
  
    <div className="App mt-5">
      {isLoading && (
        <div className="loading-overlay" id="loadingOverlay">
          <div className="loading-icon"></div>
        </div>
      )}
  
      <div className="flex rounded-md shadow-sm">
        <div className="relative flex-grow flex items-center">
          <VideoCameraIcon className="absolute h-5 w-5 text-gray-400 ml-3" aria-hidden="true" />
          <input
            type="text"
            name="youtubeUrl"
            id="youtubeUrl"
            className="block w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="YouTube Video Link"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleProcessVideo}
          className="relative inline-flex items-center ml-2 px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {/* You can replace the icon below with one that's more relevant to 'Process Video' */}
          <CloudArrowDownIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
          Summarise
        </button>
      </div>
  
      <div className="sm:flex mt-6 text-lg">
  <div dangerouslySetInnerHTML={{ __html: subtitles }} />
</div>

  
    </div>
  
  </div>
  
  );
        }  

export default App;
