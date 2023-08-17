import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../../firebase-config';

function AudioUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
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
        console.error('Failed to fetch user ID.');
        setIsLoading(false);
        return;
      }
  
      const formData = new FormData();
      formData.append('audio', selectedFile);
  
      const response = await fetch('http://localhost:3000/audio/audioup', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.text();
        setSummary(data);
  
        const firestore = getFirestore(app);
  
        await addDoc(collection(firestore, 'Audio-Summaries'), {
          type: 'audio',
          content: data,
          userID: user_id,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('Error uploading file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
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

      <strong>
        <h2>Upload an Audio File</h2>
      </strong>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button className="loadButton" onClick={handleUpload}>
        Upload
      </button>
      <div id="result">{summary}</div> {/* Display the summary here */}
    </div>
  );
}

export default AudioUpload;