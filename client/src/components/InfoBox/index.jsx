import React, { useEffect, useState } from 'react';
import { useExtractedText } from "../../contexts/";

export default function InfoBox({ blockId }) {
	// Using the new hook to get the extractedTexts object and the setter function
	const { extractedTexts } = useExtractedText();

	// Fetch the extracted text for this block using its ID
	const extractedText = extractedTexts[blockId] || '';  // default to an empty string if not found

	// If extractedText is empty, return nothing
	if (!extractedText) {
	  return null;
	}

	const [responseText, setResponseText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
	  if (extractedText) {  // if extractedText exists
		getSummary();
	  }
	}, [extractedText]);

	const getSummary = async () => {
	  try {
		setIsLoading(true);
		const prompt = "In 1 to 3 sentences explain the following:";
		const response = await fetch('https://learnt-me.onrender.com/audio/chatgpt', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			prompt: prompt,
			content: extractedText
		  })
		});

		if (!response.ok) {
		  throw new Error('Error fetching summary');
		}

		const responseData = await response.text()
		
		setResponseText(responseData || '');
    console.log("🚀 ~ file: index.jsx:43 ~ getSummary ~ responseData", responseData)

	  } catch (error) {
		console.error('Error:', error);
	  } finally {
		setIsLoading(false);
	  }
	};

  return (
    <>
    <br></br><br></br>
    <div className="bg-gray-50 sm:rounded-lg shadow">
      <div className="px-2 py-3 sm:p-4">
        <h3 className="text-xl font-semibold leading-6 text-gray-900">{extractedText}</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-700">
          {
            isLoading ?
            (
              <ul className="max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400">
                <li className="flex items-center">
                  <div role="status">
                    <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                  Gathering knowledge...
                </li>
              </ul>
            )
            : 
            <p>{responseText}</p>
          }
        </div>
      </div>
    </div>
    </>
  );
  
}


