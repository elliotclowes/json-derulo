import { useParams } from 'react-router-dom';
import { AudioRecorder, CombinedSummaryNotes } from "../../components";

function Summary() {
  const { documentId } = useParams();

  return (
    <div className="container mx-auto px-4">
      <div id="content"></div>
      <AudioRecorder documentId={documentId} />
      <CombinedSummaryNotes documentId={documentId} /> 
    </div>
  );
}

export default Summary;
