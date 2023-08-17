import { Layout, Footer,  YoutubeUpload, PageHeading } from "../../components";

export default function Youtube() {
  return (
    <Layout>
      {/* <PageHeading headingText="Create a summary from a video" /> */}
      <YoutubeUpload />
      <Footer />
    </Layout>
  );
};
