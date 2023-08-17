import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { app } from '../../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { RadioGroup } from '@headlessui/react'

const TitleInput = () => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [selectedTags, setSelectedTags] = useState([]);
  const [userTags, setUserTags] = useState([]);

  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const visibilitySettings = [
    { name: 'Public', description: 'This summary would be available to anyone who has the link', value: 'public' },
    { name: 'Private', description: 'You are the only one able to access this summary', value: 'private' },
  ];

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

  useEffect(() => {
    const fetchUserTags = async () => {
      const userID = await getUserID();
      if (userID === null) {
        console.error('User not logged in');
        return;
      }

      const summariesRef = collection(db, 'summaries');
      const q = query(summariesRef, where('userID', '==', userID));
      const querySnapshot = await getDocs(q);

      const tagCounts = {};
      querySnapshot.forEach((doc) => {
        const tags = doc.data().tags;
        tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
      setUserTags(sortedTags);
    };

    fetchUserTags();
  }, []);


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
      titleLower: title.toLowerCase(), // Lowercase version of the title
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Tags:</label>
          <div className="flex gap-2">
            {userTags.map((tag) => (
              <span
                key={tag}
                data-testid="tag-element"
                id="tag-element"
                className={`px-3 py-1 text-sm rounded-lg cursor-pointer ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <RadioGroup value={selectedVisibility} onChange={handleVisibilityChange}>
            <RadioGroup.Label className="block text-sm font-medium text-gray-700">Visibility:</RadioGroup.Label>
            <div className="-space-y-px rounded-md bg-white">
              {visibilitySettings.map((setting, settingIdx) => (
                <RadioGroup.Option
                  key={setting.name}
                  value={setting}
                  className={({ checked }) =>
                    classNames(
                      settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                      settingIdx === visibilitySettings.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                      checked ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200',
                      'relative flex cursor-pointer border p-4 focus:outline-none'
                    )
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <span
                        className={classNames(
                          checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                          active ? 'ring-2 ring-offset-2 ring-indigo-600' : '',
                          'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center'
                        )}
                        aria-hidden="true"
                      >
                        <span className="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <span className="ml-3 flex flex-col">
                        <RadioGroup.Label
                          as="span"
                          className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'block text-sm font-medium')}
                        >
                          {setting.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className={classNames(checked ? 'text-indigo-700' : 'text-gray-500', 'block text-sm')}
                        >
                          {setting.description}
                        </RadioGroup.Description>
                      </span>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus-visible:ring focus-visible:ring-blue-200 focus-visible:ring-opacity-50 transition-colors"
        >
          Create Summary
        </button>
      </form>
    </>
  );
};

export default TitleInput;
