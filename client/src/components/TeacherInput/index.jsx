import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { app } from '../../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { RadioGroup } from '@headlessui/react';

const TeacherInput = () => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [selectedTags, setSelectedTags] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentList, setStudentList] = useState([]);

  const removeStudent = (emailToRemove) => {
    setStudentList((prevStudents) => prevStudents.filter(student => student.email !== emailToRemove));
  };

  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const visibilitySettings = [
    { name: 'Private', description: ' Only you and your students can view it.', value: 'private' },
    { name: 'Public', description: ' Anyone with a link can view it.', value: 'public' },
  ];

  const people = []

  const [selectedVisibility, setSelectedVisibility] = useState(visibilitySettings[1]);

  const handleVisibilityChange = (option) => {
    setSelectedVisibility(option);
    setVisibility(option.value);
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addStudentToList = async () => {
    if (studentEmail.trim() !== '') {
      try {
        const userCollection = collection(db, 'users');
        const userSnapshot = await getDocs(query(userCollection, where("email", "==", studentEmail)));

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setStudentList(prev => [...prev, {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            imageUrl: userData.imageUrl
          }]);
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

    const response = await fetch(`https://learnt-me.onrender.com/token/get/${token}`);
    const data = await response.json();

    return data.user_id
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
          comments: []
        }
      },
      visibility: visibility,
      viewers: studentList,
      userID: userID,
      type: "teacher",
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
    <>
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

        {/* Tags logic and rendering will be same as TitleInput */}

        <div className="mb-4">
        <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700">Add Students:</label>
<div className="mt-2 relative rounded-md shadow-sm">
  <input
    type="text"
    name="studentEmail"
    id="studentEmail"
    value={studentEmail}
    onChange={(e) => setStudentEmail(e.target.value)}
    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    placeholder="Enter student email"
  />
</div>
<button 
  type="button" 
  className="mt-2 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" 
  onClick={addStudentToList}
>
  Add Student
</button>
<br></br><br></br>
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {studentList.map((student) => (
      <div
        key={student.email}
        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-red-400"
        onClick={() => removeStudent(student.email)} // Add this onClick handler
      >
        <div className="flex-shrink-0">
          <img className="h-10 w-10 rounded-full" src={student.imageUrl} alt={`${student.firstName} ${student.lastName}`} />
        </div>
        <div className="min-w-0 flex-1">
          <a href="#" className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</p>
            <p className="truncate text-sm text-gray-500">{student.email}</p>
          </a>
        </div>
      </div>
    ))}
  </div>
        </div>

        {/* Visibility radio buttons */}
        <fieldset className="mb-4">
          <legend className="sr-only">Visibility</legend>
          <div className="space-y-5">
            {visibilitySettings.map((setting) => (
              <div key={setting.value} className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id={setting.value}
                    aria-describedby={`${setting.value}-description`}
                    name="visibility"
                    type="radio"
                    defaultChecked={setting.value === visibility}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={() => handleVisibilityChange(setting)}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor={setting.value} className="font-medium text-gray-900">
                    {setting.name}
                  </label>
                  <span id={`${setting.value}-description`} className="text-gray-500">
                    {setting.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus-visible:ring focus-visible:ring-blue-200 focus-visible:ring-opacity-50 transition-colors"
        >
          Create Summary
        </button>
      </form>
    </>
  );
};

export default TeacherInput;
