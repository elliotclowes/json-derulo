import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../../firebase-config';
import { useNavigate } from 'react-router-dom';

const predefinedTags = ['Step by step Guide', 'Tutorial', 'Coding', 'Video', 'Food'];

const TeacherInput = () => {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentList, setStudentList] = useState([]);

  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleStudentEmailChange = (event) => {
    setStudentEmail(event.target.value);
  };

  const addStudentToList = async () => {
  if (studentEmail.trim() !== '') {
    try {
      const response = await fetch('http://localhost:3000/user');
      const users = await response.json();
      
      const validEmails = users.map(user => user.email);
      
      if (validEmails.includes(studentEmail)) {
        setStudentList([...studentList, studentEmail]);
        setStudentEmail('');
      } else {
        alert('Invalid student email. Please enter a valid email.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};

  const getUserID = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    const response = await fetch(`http://localhost:3000/token/get/${token}`);
    const data = await response.json();
  
    return data.user_id.toString();
  };

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
      type: "teacher",
      userID: userID,
      visibility: 'public',
      viewers: studentList,
    };
  
    try {
      const docRef = await addDoc(collection(db, 'summaries'), data); 
      console.log('Document written with ID:', docRef.id);
      
      navigate(`/teacher/${docRef.id}`);
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
        <div className="student-container">
          <label>Allow Students to View:</label>
          <input
            type="text"
            value={studentEmail}
            onChange={handleStudentEmailChange}
            placeholder="Enter student email"
          />
          <button type="button" onClick={addStudentToList}>Add Student</button>
          <div className="student-list">
            <ul>
              {studentList.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>
        </div>
        <button type="submit">Create Summary</button>
      </form>
    </div>
  );
}

export default TeacherInput;
