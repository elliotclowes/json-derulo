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
	{ name: 'Private', description: 'You are the only one able to access this summary', value: 'private' },
	{ name: 'Public', description: 'This summary would be available to anyone who has the link', value: 'public' },
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

	return data.user_id
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
		  comments: []
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
		  <label htmlFor="title" className="block text-m font-medium text-black-700">Title:</label>
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
  <label htmlFor="newTag" className="block text-m font-medium text-black-700">Add Tags:</label>
  <div className="mt-2 relative rounded-md shadow-sm">
	<input
	  type="text"
	  name="newTag"
	  id="newTag"
	  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
	  placeholder="Enter new tag"
	  onKeyPress={(event) => {
		if (event.key === 'Enter') {
		  event.preventDefault(); // To prevent form submission on Enter
		  const newTag = event.target.value;
		  if (newTag.trim() !== "") {
			setUserTags([newTag, ...userTags]);
			setSelectedTags([newTag, ...selectedTags]); // Automatically select the new tag
			event.target.value = "";
		  }
		}
	  }}
	/>
  </div>
</div>
			{userTags.length > 0 && (
			<div className="mb-4">
				<label className="block text-m font-medium text-black-700">Select Tags:</label>
				<div className="flex gap-2">
				{userTags.map((tag) => (
					<span
					key={tag}
					className={`px-3 py-1 text-sm rounded-lg cursor-pointer ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black-700'}`}
					onClick={() => handleTagClick(tag)}
					>
					{tag}
					</span>
				))}
				</div>
			</div>
			)}
		<hr></hr><br></br>
		<fieldset>
			<label className="block text-m font-medium text-black-700">Visibility</label><br></br>
			<legend className="sr-only">Visibility</legend>
			<div className="space-y-5">
				{visibilitySettings.map((setting) => (
				<div key={setting.id} className="relative flex items-start">
					<div className="flex h-6 items-center">
					<input
						id={setting.id}
						aria-describedby={`${setting.id}-description`}
						name="visibility"
						type="radio"
						defaultChecked={setting.id === 'private'}
						className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
						onChange={() => handleVisibilityChange(setting)} // or you can change the way you handle the change.
					/>
					</div>
					<div className="ml-3 text-sm leading-6">
					<label htmlFor={setting.id} className="font-medium text-gray-900">
						{setting.name}
					</label>{' '}
					<span id={`${setting.id}-description`} className="text-gray-500">
						{setting.description}
					</span>
					</div>
				</div>
				))}
			</div>
			</fieldset>
			<br></br>
			<hr></hr>
<br></br>
		<button
		  type="submit"
		  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus-visible:ring focus-visible:ring-blue-200 focus-visible:ring-opacity-50 transition-colors"
		>
		  Create Summary
		</button>
	  </form>
	</>
  );
};

export default TitleInput;
