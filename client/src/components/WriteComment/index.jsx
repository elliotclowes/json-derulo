import React, { Fragment, useState, useEffect } from 'react'
import { CheckCircleIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Listbox, Transition } from '@headlessui/react'

import { getFirestore, collection, doc, updateDoc, onSnapshot, getDoc, arrayUnion } from 'firebase/firestore';
import { app } from '/firebase-config.js';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function WriteComment({ documentId, blockId }) {
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const [activity, setActivity] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [imageUrl, setImageUrl] = useState("");



  const getUserID = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    const response = await fetch(`http://localhost:3000/token/get/${token}`);
    const data = await response.json();
  
    return data.user_id
    };



    function timeAgo(isoTime) {
      const now = new Date();
      const timestamp = new Date(isoTime);
      const secondsPast = (now.getTime() - timestamp.getTime()) / 1000;
    
      if (secondsPast < 60) {
        return `${Math.round(secondsPast)}s ago`;
      }
      if (secondsPast < 3600) {
        return `${Math.round(secondsPast / 60)}m ago`;
      }
      if (secondsPast <= 86400) {
        return `${Math.round(secondsPast / 3600)}h ago`;
      }
      if (secondsPast > 86400) {
        const daysPast = Math.round(secondsPast / 86400);
        return `${daysPast}d ago`;
      }
    }

    useEffect(() => {
      async function prefetchUserData() {
          const userID = await getUserID();
          const userData = await getUserData(userID);
          if (userData && userData.imageUrl) {
              setImageUrl(userData.imageUrl);
          }
      }
  
      prefetchUserData();
  }, []);
    


  // Function to toggle the visibility of the comment box
// Function to toggle the visibility of the comment box
const toggleCommentBox = () => {
  setCommentBoxVisible(!commentBoxVisible);
};



  const db = getFirestore(app);

  useEffect(() => {
    const summariesCollection = collection(db, 'summaries');
    const docRef = doc(summariesCollection, documentId);
  
    // Set up the real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const block = data.blocks[blockId];
            if (block && block.comments) {
                setActivity(block.comments);
            }
        }
    });

    // Cleanup function
    return () => {
        unsubscribe();
    };

}, [documentId, blockId]);




const getUserData = async (userID) => {
  try {
      const userIdString = userID.toString();
      const userDocRef = doc(collection(db, 'users'), userIdString);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          return {
              name: `${userData.firstName} ${userData.lastName}`,
              imageUrl: userData.imageUrl
          };
      }
  } catch (error) {
      console.error("Error fetching user data: ", error);
  }
  return null;  // return null if there's an error or if the document doesn't exist
};



const handleCommentSubmit = async (e) => {
  e.preventDefault();

  const userID = await getUserID();
  const userData = await getUserData(userID);

  if (!userData) {
      console.error("Unable to fetch user data.");
      return;  // exit the function if no user data is found
  }

  const newComment = {
      userID: userID,
      type: 'commented',
      person: {
          name: userData.name,
          imageUrl: userData.imageUrl
      },
      comment: commentText,
      dateTime: new Date().toISOString()
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
    <div className="hoverWrapper relative group">
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
                    <time dateTime={timeAgo(activityItem.dateTime)} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                      {timeAgo(activityItem.dateTime)}
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
                <time dateTime={timeAgo(activityItem.dateTime)} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                {timeAgo(activityItem.dateTime)}
                </time>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Clickable text to toggle comment box */}
      {!commentBoxVisible &&
      <div className="mt-4 cursor-pointer text-indigo-600 flex justify-center items-center transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:visible invisible" onClick={toggleCommentBox}>


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
          src={imageUrl}
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
      </div>
    </>
  )
}

