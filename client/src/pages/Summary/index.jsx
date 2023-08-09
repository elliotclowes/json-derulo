import { useParams } from 'react-router-dom';
import { SummaryInput, BlockInput, BlocksDisplay } from "../../components";

function Summary() {
  const { documentId } = useParams();

  return (
    <div>
      <div id="content"></div>
      <SummaryInput documentId={documentId} />
      <hr />
      <BlockInput documentId={documentId} />
      <hr />
      <BlocksDisplay documentId={documentId} />
    </div>
  );
}

export default Summary;
