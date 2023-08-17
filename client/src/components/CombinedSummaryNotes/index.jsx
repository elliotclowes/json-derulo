import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';
import { Footer, AudioRecorder, TextEditor, WriteComment, InfoBox } from "../../components";
import { useExtractedText } from "../../contexts/";
import { BellIcon } from '@heroicons/react/24/outline'
import DetailButton  from '../DetailButton';
import AddMoreDetailButton from '../MoreDetailButton'

function CombinedSummaryNotes() {
  const { extractedTexts } = useExtractedText();
  const { documentId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [dataFromDetailButton, setDataFromDetailButton] = useState("")
  const [shortSummary, setShortSummary] = useState(false)
  const db = getFirestore(app);
  const [isLoading, setIsLoading] = useState(false);
  const [nextSteps, setNextSteps] = useState([]);


  const updateSummaryBlock = async (blockId, newText) => {
    // Get the Firestore reference to the specific document
    const summariesCollection = collection(db, 'summaries');
    const summariesRef = doc(summariesCollection, documentId);
  
    // Create a path to the specific block you want to update
    const blockPath = `blocks.${blockId}.text`;
  
    // Create an object representing the update
    const updateObject = {
      [blockPath]: newText,
    };
  
    // Update the text of the specific block
    await updateDoc(summariesRef, updateObject).catch(error => {
      console.error('Error updating block:', error);
    });
  };
  useEffect(() => {
    const summariesCollection = collection(db, 'summaries');
    const docRef = doc(summariesCollection, documentId);
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const blocksArray = data.blockOrder.map(blockId => data.blocks[blockId].text);
        setBlocks(blocksArray);
      } else {
        console.log("No such document!");
      }
    });
    return () => unsubscribe();
  }, [documentId, db]);
  
  const handleBlockSubmit = (blockId, newText) => {
    updateSummaryBlock(`block${blockId + 1}`, newText);
  };

  const handleLearnMore = async () => {
    try {
      setIsLoading(true);
      const prompt = "Please provide 3 bullet points on what to learn next and make them 1-4 words each :";
      const combinedText = blocks.map(blockText => {
        if (typeof blockText === 'object') {
          // Convert the object to a string representation
          return JSON.stringify(blockText);
        }
        return blockText; // If it's already a string, leave it as is
      }).join(' ');
      
      const response = await fetch('http://localhost:3000/audio/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          content: combinedText
        })
      });
  
      if (!response.ok) {
        throw new Error('Error fetching next steps');
      }
  
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
  
        if (data && data.nextSteps) {
          setNextSteps(data.nextSteps);
        } else {
          throw new Error('Invalid JSON response');
        }
      } else {
        const plainTextResponse = await response.text();
        const sentences = plainTextResponse.split('. '); 
        setNextSteps(sentences);
      }
  
    } catch (error) {
      console.error('Error fetching next steps:', error);
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
=======
  const handleDetailButtonClick = async (data) => {
    console.log("preUpdate",dataFromDetailButton)
    // Update the state with the extracted data
    console.log("LOOL",data)
    await setDataFromDetailButton(data);

    await setShortSummary(true)
    console.log(shortSummary)
  };
  useEffect(()=>{
    console.log(dataFromDetailButton)
    setShortSummary(!shortSummary)
    console.log(shortSummary)
  },[dataFromDetailButton])

  useEffect(() => {
    if (!shortSummary && dataFromDetailButton && blocks.length > 0 && blocks[0].length > 0) {
      setBlocks(prevBlocks => {
        const updatedBlocks = [...prevBlocks];
        updatedBlocks[0][0].children[0].text = dataFromDetailButton;
        return updatedBlocks;
      });
    }
  }, [shortSummary, dataFromDetailButton]);
    


>>>>>>> 6190a1ae526f2630b1b846cb0ead19fa0578c58f
  return (
    <>
    <div className="flex min-h-full flex-col">
        <header className="shrink-0 bg-gray-900">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <a href="/"><img
              className="h-8 w-auto"
              src="https://firebasestorage.googleapis.com/v0/b/learnt-me-test.appspot.com/o/manual%2Flogo.svg?alt=media&token=1b976e10-5cf3-42e0-827a-136ced55ba58"
              alt="Audify.me"
            /></a>
            <div className="flex items-center gap-x-8">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your profile</span>
                <img
                  className="h-8 w-8 rounded-full bg-gray-800"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </a>
            </div>
          </div>
        </header>
    {/* Wrapper */}
<<<<<<< HEAD
    <div className="mx-auto w-full max-w-7xl grow xl:px-2">
    {blocks.map((blockText, index) => (
      <div key={index} className="lg:flex">
        {/* Left sidebar */}
        <div className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
          <p>Left</p>
        </div>
        {/* Main content */}
=======
        <div className="mx-auto w-full max-w-7xl grow xl:px-2">
          {blocks.map((blockText, index) => (
            <div key={index} className="lg:flex">
              {/* Left Sidebar (Shorten & InfoBox) */}
              <div className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
              <DetailButton document={blockText} onDetailButtonClick={handleDetailButtonClick} />
            <AddMoreDetailButton document={blockText} onDetailButtonClick={handleDetailButtonClick} />
                {/* InfoBox for Each Block */}
                <InfoBox
  blockId={`block${index + 1}`} 
  extractedText={extractedTexts[`block${index + 1}`]}
/>
              </div>
  
              {/* Main content */}
              <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                <TextEditor 
                  document={blockText} 
                  onChange={(newText) => updateSummaryBlock(`block${index + 1}`, newText)} 
                  onSubmit={(newText) => handleBlockSubmit(index, newText)} 
                  blockId={`block${index + 1}`}
                />
              </div>
  
              {/* Right sidebar */}
              <div className="shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
                <WriteComment documentId={documentId} blockId={`block${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
  
        {/* Audio and Next Steps */}
>>>>>>> 6190a1ae526f2630b1b846cb0ead19fa0578c58f
        <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
          <AudioRecorder documentId={documentId} />
          <button className="learnMoreButton" onClick={handleLearnMore} disabled={isLoading}>
            Learn More
          </button>
  
          <div className="nextSteps">
            {nextSteps.length > 0 && (
              <div>
                <h2>What to Learn Next:</h2>
                <ul>
                  {nextSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
      </div>
    </div>
    </>
  );
}

export default CombinedSummaryNotes;