import React, { useState } from 'react';
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

    const response = await fetch(`http://localhost:3000/token/get/${token}`);
    const data = await response.json();

    return data.user_id.toString();
  };


  // Get the current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();


  const handleSubmit = async (event) => {
    event.preventDefault();

    const userID = await getUserID();
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
      created: formattedDate,
      tags: selectedTags,
      title: title,
      type: "user",
      userID: userID,
      visibility: visibility,
    };

    try {
      const docRef = await addDoc(collection(db, 'summaries'), data);
      console.log('Document written with ID:', docRef.id);

      navigate(`/summary/${docRef.id}`);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  return (
      <div className="max-w-500 mx-auto">
        <form className="title-form p-4 rounded-lg shadow-md bg-white" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
            placeholder="Enter title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Visibility:</label>
          <div className="flex gap-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="public"
                checked={visibility === 'public'}
                onChange={handleVisibilityChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Public</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="private"
                checked={visibility === 'private'}
                onChange={handleVisibilityChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Private</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Tags:</label>
          <div className="flex gap-2">
            {predefinedTags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 text-sm rounded-lg cursor-pointer ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus-visible:ring focus-visible:ring-blue-200 focus-visible:ring-opacity-50 transition-colors"
        >
          Create Summary
        </button>
      </form>
    </div>
  );
}

export default TitleInput;
