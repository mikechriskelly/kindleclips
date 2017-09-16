import React from 'react';
import Clipping from './Clipping';

const clip = {}; // TODO: Data fetch e.g. await ClipActions.fetchPrimary(slug);
const title = 'Kindle Clips'; // TODO: Insert data e.g. ${props.title} - ${props.author}

function action() {
  return {
    chunks: ['clipping'],
    title,
    components: <Clipping {...clip} />,
  };
}

export default action;
