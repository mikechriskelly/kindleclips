import React from 'react';
import Search from './Search';
import ClipActions from '../../actions/ClipActions';

export default {

  path: '/s/:slug',

  async action(context) {
    const searchTerm = context.params.slug;
    const clips = await ClipActions.fetchMatching(searchTerm);
    return <Search searchTerm={searchTerm} results={clips} />;
  },

};
