import { useParams } from 'react-router-dom';
import { AudioRecorder, CombinedSummaryNotes } from "../../components";

function Summary() {
  const { documentId } = useParams();

  return (
    <div>
      <div id="content"></div>
      <AudioRecorder />
      <CombinedSummaryNotes documentId={documentId} /> 
    </div>
  );
}

export default Summary;
