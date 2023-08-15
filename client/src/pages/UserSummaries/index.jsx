import { Layout, Footer, UserSummariesList, PageHeading } from "../../components";

export default function UserSummaries() {
  return (
    <Layout>
      <PageHeading headingText="Your Summaries" />
      <UserSummariesList />
      <Footer />
    </Layout>
  );
};
