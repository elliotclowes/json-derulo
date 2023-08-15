import React, { useState } from 'react';

function AudioUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('Please select a file.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
  
      const response = await fetch('http://localhost:3000/audio/audioup', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const data = await response.text(); 
        console.log(data,'yoyo'); 
        const resultElement = document.getElementById('result');
        resultElement.textContent = data;
      } else {
        console.error('Error uploading file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

  return (
    <div>
      <h2>Upload an Audio File</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div id="result">{message}</div> {/* Display the response here */}
    </div>
  );
  }

export default AudioUpload