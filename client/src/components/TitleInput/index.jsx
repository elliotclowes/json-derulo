import React, { useState } from 'react';
import './TitleInput.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../../firebase-config';
import { useNavigate } from 'react-router-dom';

const predefinedTags = ['Step by step Guide', 'Tutorial', 'Coding', 'Video', 'Food'];

const TitleInput = () => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [selectedTags, setSelectedTags] = useState([]);

  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getUserID = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    const response = await fetch(`https://learnt-me.onrender.com/token/get/${token}`);
    const data = await response.json();
  
    return data.user_id.toString();
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userID = await getUserID();
    console.log("🚀 ~ file: index.jsx:48 ~ handleSubmit ~ userID:", userID)
    if (userID === null) {
      console.error('User not logged in');
      return;
    }
  
    const data = {
      blockOrder: ["block1"],
      blocks: {
        block1: {
          text: [
            {
              type: "h2",
              children: [{ text: title }]
            }
          ],
          audioURL: "",
          comments: [{}]
        }
      },
      type: "user",
      userID: userID
      }
    console.log("🚀 ~ file: index.jsx:69 ~ handleSubmit ~ data:", data)
  
    try {
      const docRef = await addDoc(collection(db, 'summaries'), data); 
      console.log('Document written with ID:', docRef.id);
      
      navigate(`/summary/${docRef.id}`); 
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  return (
    <div>
      <form className="title-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter title"
          />
        </div>
        <div>
          <label>Visibility:</label>
          <label>
            <input
              type="radio"
              value="public"
              checked={visibility === 'public'}
              onChange={handleVisibilityChange}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              value="private"
              checked={visibility === 'private'}
              onChange={handleVisibilityChange}
            />
            Private
          </label>
        </div>
        <div className="tag-container">
          <label>Select Tags:</label>
          <div className="tag-list">
            {predefinedTags.map((tag) => (
              <span
                key={tag}
                className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button type="submit">Create Summary</button>
      </form>
    </div>
  );
}

export default TitleInput;
