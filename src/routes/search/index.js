import React from 'react';
import Search from './Search';

const searchTerm = ''; // TODO: Insert from URL
const clips = {}; // TODO: Data Fetch e.g. await ClipActions.fetchMatching(searchTerm);
const title = 'Kindle Clips';

function action() {
  return {
    chunks: ['search'],
    title,
    component: <Search searchTerm={searchTerm} results={clips} />,
  };
}

export default action;
