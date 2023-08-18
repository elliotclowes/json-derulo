import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'




function ShortenData({onDetailButtonClick, document, index}) {
    // const { documentId } = useParams();
    const [blocks, setBlocks] = useState([]);
    const [dataAsString, setDataAsString] = useState("");
    const [summary, setSummary] = useState('');
    const [sendableData, setSendableData] = useState({
        "prompt": `Please summarize the following text:`,
        "content": dataAsString
    })
    const [buttonTag, setButtonTag] = useState("Less Detail")
    const [open, setOpen] = useState(true)


    const makeDataJson = async (document) => {
        let compiledData = await dataAsString
        
        for (let i = 0; i < document.length; i++){
            if (document[i].children.length>1){
                for (let j =0 ; j<document[i].length; j++){
                    compiledData += (document[i].children[j].text)
            }}
            else if (document[i].children[0].text) {
                compiledData += (document[i].children[0].text)
                
            }
            
        }
        setDataAsString(compiledData)
        setSendableData({
            "prompt": `Please summarize the following text:`,
            "content": compiledData
        })
        return dataAsString,sendableData
    };
    useEffect( () => {
        console.log("Updated dataAsString:", dataAsString)
        console.log("Sendable Object: ", sendableData)
    }, [dataAsString])

const sendBackData = async () => {
    setButtonTag('Less Detail')
    const data = await handleShortenSummary()
    console.log(data, "   summary")
    setDataAsString('')
    setSendableData({
        "prompt": `Please summarize the following text:`,
        "content": ''
    })
    

    console.log("hello!!!!!")
    onDetailButtonClick(data, index)
}

//when the user doesn't want a shorter summary just update state variables to reset all
const noButton = () => {
    setButtonTag('Less Detail')
    setDataAsString('')
    setSendableData({
        "prompt": `Please summarize the following text:`,
        "content": ''
    })
    console.log('no!!!!')
}
    
const handleShortenSummary = async () => {
    console.log("this is the document:", document)
    if(buttonTag == 'Less Detail'){setButtonTag(`Confirm?`)} 
    if(buttonTag == 'Confirm?') {
    setButtonTag('Less Detail');
    setDataAsString('');
    setSummary('');
    setSendableData({
        "prompt": `Please summarize the following text:`,
        "content": dataAsString
        })
    }
    try {
        await makeDataJson(document)
        const response = await fetch('https://learnt-me.onrender.com/audio/chatgpt', {
            method: 'POST',
            body: JSON.stringify(sendableData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(await dataAsString);
        console.log(await sendableData);
        if (response.ok) {
            const data = await response.text();
            setSummary(data); // Update the summary state with the response
            console.log(data, 'fish');
            return data
        } else {
            console.error('Error uploading file.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
    
    
};

return (
    <>
        {/* Button design */}
        {buttonTag !== 'Confirm?' && (
            <button
                type="button"
                className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                onClick={handleShortenSummary}
            >
                &nbsp;Shorten&nbsp;
            </button>
        )}

        {/* Confirm action buttons */}
        {buttonTag === 'Confirm?' && (
            <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
        
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        {/* Assuming you have the XMarkIcon imported */}
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
        
                                <div className="mt-3 text-center sm:text-left">
                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        Confirm Shortening
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            <b>Warning:</b>  shortening your summary produces new text, so any formatting or styling will be removed.
                                        </p>
                                    </div>
                                </div>
        
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        onClick={sendBackData}
                                    >
                                        Shorten
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={noButton}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
        
        )}
    </>
);
}

export default ShortenData;
