import { useExtractedText } from "../../contexts/";


export default function InfoBox({ blockId }) {
    // Using the new hook to get the extractedTexts object and the setter function
    const { extractedTexts } = useExtractedText();

    // Fetch the extracted text for this block using its ID
    const extractedText = extractedTexts[blockId] || '';  // default to an empty string if not found

    return (
      <div className="bg-gray-50 sm:rounded-lg">
        <div className="px-2 py-3 sm:p-4">
          <div className="mt-2 max-w-xl text-sm text-gray-700">
            <p>{extractedText}</p>
          </div>
          {/* <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
             Get more info
            </button>
          </div> */}
        </div>
      </div>
    )
  }
  