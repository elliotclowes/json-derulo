import { Layout, Footer, AudioUpload, YoutubeUpload } from "../../components";

export default function Youtube() {
  return (
    <Layout>
      <YoutubeUpload />
      <br />
      <AudioUpload />
      <Footer />
    </Layout>
  );
};
