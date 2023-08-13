import { useNavigate, useParams, Link } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../../firebase-config';
import { useEffect, useState } from 'react';
import DeleteSummaryConfirmationDialog from '../../components/DeleteSummaryConfirmationDialog';
import { XCircleIcon } from '@heroicons/react/20/solid'

export default function SearchResults() {
  const { searchText } = useParams(); // Get search text from the URL
  const decodedSearchText = decodeURIComponent(searchText); // Decode URL
  const lowercaseSearchText = decodedSearchText.toLowerCase(); // Convert to lowercase
  const [summaries, setSummaries] = useState([]);
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteSummaryId, setDeleteSummaryId] = useState(null); // To hold the ID of the summary being deleted
  const [deleteSummaryTitle, setDeleteSummaryTitle] = useState(null); // To hold the title of the summary being deleted

  const handleShowDeleteDialog = (summaryId, summaryTitle) => {
    setDeleteSummaryId(summaryId);
    setDeleteSummaryTitle(summaryTitle); // pass title as a prop to the dialog
    setShowDeleteDialog(true);
  };

  // Function to handle the deletion
  const handleDeleteSummary = async () => {
    try {
      const db = getFirestore(app);
      const summaryRef = doc(db, 'summaries', deleteSummaryId);
  
      await deleteDoc(summaryRef);
  
      setSummaries(summaries.filter((summary) => summary.id !== deleteSummaryId));
    } catch (error) {
      console.error('Failed to delete summary:', error);
      // TODO: show message to user if deletion fails
    } finally {
      setShowDeleteDialog(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const summariesCollection = collection(db, 'summaries');

      const q = query(summariesCollection, where('titleLower', '==', lowercaseSearchText));
      const querySnapshot = await getDocs(q);

      const summariesArray = [];
      querySnapshot.forEach((doc) => {
        summariesArray.push({ id: doc.id, ...doc.data() });
      });
      setSummaries(summariesArray);
    };

    fetchData();
  }, [searchText]); // Re-run whenever the search text changes


  const handleCreateNewSummary = () => {
    navigate('/summary');
  };


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Search Results for: {searchText}</h1>
          <p className="mt-2 text-sm text-gray-700">
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleCreateNewSummary}
          >
            Create new summary
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <DeleteSummaryConfirmationDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onDelete={handleDeleteSummary}
          summaryTitle={deleteSummaryTitle}
        />
        {summaries.length > 0 ? (
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-2/5 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="w-2/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tags
                    </th>
                    <th scope="col" className="w-1/8 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Visibility
                    </th>
                    <th scope="col" className="w-2/8 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Delete</span>
                  </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                      {summaries.map((summary) => (
                      <tr key={summary.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <Link to={`/summary/${summary.id}`} className="text-indigo-600 hover:text-indigo-900">
                        {summary.title}
                      </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {summary.tags && summary.tags.map((tag, index) => (
                            <Link key={index} to={`/summaries/tag/${tag}`} className="inline-block px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded-full mr-1">
                              {tag}
                            </Link>
                          ))}
                        </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{summary.visibility}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(summary.created).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {summary.title}</span>
                        </a>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleShowDeleteDialog(summary.id, summary.title); }} className="text-red-600 hover:text-red-900">
                      Delete<span className="sr-only">, {summary.title}</span>
                    </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        ) : (
            <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">No search results found</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
