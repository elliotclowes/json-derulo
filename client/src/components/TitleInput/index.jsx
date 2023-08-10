import React, { useState } from 'react';
import './TitleInput.css'; 

const predefinedTags = ['Step by step Guide', 'Tutorial', 'Coding', 'Video', 'Food'];

const TitleInput = () => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('public'); 
  const [selectedTags, setSelectedTags] = useState([]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Title:', title);
    console.log('Visibility:', visibility);
    console.log('Selected Tags:', selectedTags);

    window.location.href = '/recorder';
  };

  return (
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
  );
};

export default TitleInput;