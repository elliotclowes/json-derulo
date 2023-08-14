import React from 'react';
<<<<<<< HEAD
import { Settings } from "../../components"


export default function UserSettings() {
    return (
        <main>
            <Settings />
        </main>
    )
}
=======
import Layout from '../../components/Layout';
import Footer from '../../components/Footer';
import Settings from '../../components/Settings';

const CreateSummary = () => {
  return (
    <Layout>
      <Settings />
      <Footer />
    </Layout>
  );
};

export default CreateSummary;
>>>>>>> 8d50ee8ed9d86104de03849ffe2ea6f4ea37c02c
