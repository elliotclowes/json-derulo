import React, { useEffect, useState } from 'react';
import { useExtractedText } from "../../contexts/";

export default function InfoBox({ blockId }) {
	// Using the new hook to get the extractedTexts object and the setter function
	const { extractedTexts } = useExtractedText();

	// Fetch the extracted text for this block using its ID
	const extractedText = extractedTexts[blockId] || '';  // default to an empty string if not found

	// State to hold the response
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
		const response = await fetch('http://localhost:3000/audio/chatgpt', {
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
	  <div className="bg-gray-50 sm:rounded-lg">
		<div className="px-2 py-3 sm:p-4">
		  <h3 className="text-base font-semibold leading-6 text-gray-900">{extractedText}</h3>
		  <div className="mt-2 max-w-xl text-sm text-gray-700">
			<p>{isLoading ? 'Loading...' : responseText}</p>  {/* Display response or loading */}
		  </div>
		</div>
	  </div>
	)
}
