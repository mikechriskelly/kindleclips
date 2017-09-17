import React from 'react';
import Layout from '../../components/Layout';
import Clipping from './Clipping';

const clip = {}; // TODO: Data fetch e.g. await ClipActions.fetchPrimary(slug);
const title = 'Kindle Clips'; // TODO: Insert data e.g. ${props.title} - ${props.author}

function action() {
  return {
    chunks: ['clipping'],
    title,
    component: (
      <Layout>
        <Clipping {...clip} />
      </Layout>
    ),
  };
}

export default action;
