import React, { useState } from 'react';

function AudioUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
        console.log('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', selectedFile);

    fetch('http://localhost:3000/audio/save', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('File uploaded successfully.');
        } else {
            console.log('File upload failed.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        console.log('An error occurred during upload.');
      });
  };

  return (
    <div>
      <h2>Upload an Audio File</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div>{message}</div>
    </div>
  );
}

export default AudioUpload;
