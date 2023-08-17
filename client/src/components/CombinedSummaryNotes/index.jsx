import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';
import { Footer, AudioRecorder, TextEditor, WriteComment, InfoBox, Playback } from "../../components";
import { useExtractedText } from "../../contexts/";
import DetailButton  from '../DetailButton';
import AddMoreDetailButton from '../MoreDetailButton'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Dashboard', href: '/dash', current: false },
  { name: 'Classes', href: '#', current: false },
  { name: 'Recorded Summaries', href: '/summaries', current: false },
  { name: 'Uploaded Summaries', href: '#', current: false },
  { name: 'Video Summaries', href: '#', current: false },
  { name: 'Record Live', href: '/summary', current: true },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

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
    <div
    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
    aria-hidden="true"
>
    <div
        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style={{
            clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
    />
</div>
<div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{user.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Live Summary</h1>
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
    <div className="relative">
        <div
    className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
    aria-hidden="true"
>
    <div
        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style={{
            clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
    />
</div>
</div>
    <Footer />
    <br></br>
   
    </>
  );
}

export default CombinedSummaryNotes;
