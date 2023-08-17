import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';
import { Footer, AudioRecorder, TextEditor, WriteComment, InfoBox, Playback } from "../../components";
import { useExtractedText } from "../../contexts/";
import DetailButton  from '../DetailButton';
import AddMoreDetailButton from '../MoreDetailButton'
import { PlusIcon } from '@heroicons/react/20/solid'

function CombinedSummaryNotes() {
  const { extractedTexts } = useExtractedText();
  const { documentId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [dataFromDetailButton, setDataFromDetailButton] = useState("")
  const [shortSummary, setShortSummary] = useState(false)
  const db = getFirestore(app);
  const [detailIndex, setDetailIndex] = useState(1);


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


  const handleDetailButtonClick = async (data, index) => {
    console.log("preUpdate",dataFromDetailButton)
    // Update the state with the extracted data
    console.log("LOOL",data)
    await setDataFromDetailButton(data);
    await setDetailIndex(index)
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
        console.log(blocks)
        const updatedBlocks = [...prevBlocks];
        updatedBlocks[detailIndex][0].children[0].text = dataFromDetailButton;
        return updatedBlocks;
      });
    }
  }, [shortSummary, dataFromDetailButton]);
    


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
        <div className="mx-auto w-full max-w-7xl grow xl:px-2">

        {blocks.map((blockText, index) => (
  <div key={index} className="lg:flex">

    
    {/* Left Sidebar (Shorten & InfoBox) */}
<div className="w-1/4 border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-84 xl:border-b-0 xl:border-r xl:pl-6">
  {index!=0?<>
                  <DetailButton document={blockText} onDetailButtonClick={handleDetailButtonClick} index={index}/>
                  <AddMoreDetailButton document={blockText} onDetailButtonClick={handleDetailButtonClick} index={index}/>
                </>:null}
                <Playback documentId={documentId} blockId={`block${index + 1}`} />
  {/* InfoBox for Each Block */}
  <InfoBox
    blockId={`block${index + 1}`} 
    extractedText={extractedTexts[`block${index + 1}`]}
  />
     
</div>
  
              {/* Main content */}
<div className="flex-1 px-4 py-6 sm:px-6 lg:pl-8">
  <TextEditor 
    document={blockText} 
    onChange={(newText) => updateSummaryBlock(`block${index + 1}`, newText)} 
    onSubmit={(newText) => handleBlockSubmit(index, newText)} 
    blockId={`block${index + 1}`}
  />
</div>

{/* Right sidebar */}
<div className="shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-1/4 lg:border-l lg:border-t-0 lg:pr-8 xl:w-84">
  <WriteComment documentId={documentId} blockId={`block${index + 1}`} />
</div>
            </div>
          ))}
        </div>
  
        {/* Audio and Next Steps */}
        <div className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">


        <AudioRecorder documentId={documentId} blocks={blocks} />

</div>
    </div>
    <Footer />
    <br></br>
    </>
  );
}

export default CombinedSummaryNotes;
