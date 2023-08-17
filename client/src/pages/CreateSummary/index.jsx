import React from 'react';
import Layout from '../../components/Layout';
import TitleInput from '../../components/TitleInput';
import Footer from '../../components/Footer';
import PageHeading from '../../components/PageHeading';

const CreateSummary = () => {
  return (
    <Layout>
      <PageHeading headingText="Start a new summary" />
      <TitleInput />
      <Footer />
    </Layout>
  );
};

export default CreateSummary;
