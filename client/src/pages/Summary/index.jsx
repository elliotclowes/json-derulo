import { useParams } from 'react-router-dom';
import { SummaryInput, BlockInput, BlocksDisplay, CombinedSummaryNotes } from "../../components";

function Summary() {
  const { documentId } = useParams();

  return (
    <div>
      <div id="content"></div>
      <CombinedSummaryNotes documentId={documentId} /> 
    </div>
  );
}

export default Summary;
