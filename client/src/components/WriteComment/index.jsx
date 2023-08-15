import React, { Fragment, useState, useEffect } from 'react'
import { CheckCircleIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Listbox, Transition } from '@headlessui/react'

import { getFirestore, collection, doc, updateDoc, onSnapshot, getDoc, arrayUnion } from 'firebase/firestore';
import { app } from '/firebase-config.js';

// const activity = [
//   {
//     userID: 1,
//     type: 'commented',
//     person: {
//       name: 'Chelsea Hagon',
//       imageUrl:
//         'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     comment: 'Called client, they reassured me the invoice would be paid by the 25th.',
//     dateTime: '2023-01-23T15:56',
//   },
// ]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function WriteComment({ documentId, blockId }) {
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const [activity, setActivity] = useState([]);
  const [commentText, setCommentText] = useState('');


  const getUserID = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    const response = await fetch(`http://localhost:3000/token/get/${token}`);
    const data = await response.json();
  
    return data.user_id
    };


  // Function to toggle the visibility of the comment box
  const toggleCommentBox = () => {
    setCommentBoxVisible(!commentBoxVisible);
  };

  const db = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const summariesCollection = collection(db, 'summaries');
          const docRef = doc(summariesCollection, documentId);
          const docSnapshot = await getDoc(docRef);  // Fetch the document
  
          if (docSnapshot.exists) {  // Check if the document exists
              const data = docSnapshot.data();
              
              // Access the block using the blockId as a key
              const block = data.blocks[blockId];
              if (block && block.comments) {
                  setActivity(block.comments);
              }
          }
      } catch (error) {
          console.error("Error fetching data: ", error);
      }
    };
    fetchData();
}, [documentId, blockId]);



const handleCommentSubmit = async (e) => {
  e.preventDefault();

  const userID = await getUserID();

  const newComment = {
      userID: userID,
      type: 'commented',
      person: {
          name: 'Elliot Clowes', // This should ideally come from the user's profile, for now, I'm hardcoding
          imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',  // This too
      },
      comment: commentText,
      dateTime: new Date().toISOString(),  // Setting it to the current time
  };

  try {
      const summariesCollection = collection(db, 'summaries');
      const docRef = doc(summariesCollection, documentId);
      
      await updateDoc(docRef, {
          [`blocks.${blockId}.comments`]: arrayUnion(newComment)
      });

      // Reset the comment box
      setCommentText('');
      setCommentBoxVisible(false);

  } catch (error) {
      console.error("Error adding comment: ", error);
  }
}




  return (
    <>
      <ul role="list" className="space-y-6">
        {activity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.userID} className="relative flex gap-x-4">
            <div
              className={classNames(
                activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>
            {activityItem.type === 'commented' ? (
              <>
                <img
                  src={activityItem.person.imageUrl}
                  alt=""
                  className="relative mt-3 h-8 w-8 flex-none rounded-full bg-gray-50"
                />
                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                  <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5 text-gray-500">
                      <span className="font-medium text-gray-900">{activityItem.person.name}</span>
                    </div>
                    <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                      {activityItem.dateTime}
                    </time>
                  </div>
                  <p className="text-sm leading-5 text-gray-500">{activityItem.comment}</p>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                  {activityItem.type === 'paid' ? (
                    <CheckCircleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                  )}
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                  <span className="font-medium text-gray-900">{activityItem.person.name}</span> {activityItem.type} the
                  invoice.
                </p>
                <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                {activityItem.dateTime}
                </time>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Clickable text to toggle comment box */}
      {!commentBoxVisible &&
      <div className="mt-4 cursor-pointer text-indigo-600 flex justify-center items-center" onClick={toggleCommentBox}>
  <button
    type="button"
    className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
    Add a comment
  </button>
</div>
}
      {/* Conditionally render the comment form based on the commentBoxVisible state */}
      {commentBoxVisible && (
        <div className="mt-6 flex gap-x-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
          className="h-8 w-8 flex-none rounded-full bg-gray-50"
        />
        <form action="#" className="relative flex-auto" onSubmit={handleCommentSubmit}>
          <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={2}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              
            </div>
            <button
              type="submit"
              className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
      )}
    </>
  )
}

