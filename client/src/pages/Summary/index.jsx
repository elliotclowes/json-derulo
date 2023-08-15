import { useParams } from 'react-router-dom';
import { Layout, Footer, AudioRecorder, CombinedSummaryNotes, DetailButton } from "../../components";

export default function Summary() {
  const { documentId } = useParams();

  return (
    <Layout>
      <AudioRecorder documentId={documentId} />
      <DetailButton documentId = {documentId}/>
      <CombinedSummaryNotes documentId={documentId} /> 
      <Footer />
    </Layout>
  );
};

