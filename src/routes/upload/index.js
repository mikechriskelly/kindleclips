import React from 'react';
import Layout from '../../components/Layout';
import Upload from './Upload';

const title = 'Upload';
const isLoading = false; // TODO: Tack loading state

function action() {
  return {
    chunks: ['upload'],
    title,
    component: (
      <Layout>
        <Upload title={title} isLoading={isLoading} />
      </Layout>
    ),
  };
}

export default action;
