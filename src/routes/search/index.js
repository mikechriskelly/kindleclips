import React from 'react';
import Search from './Search';
import ClipActions from '../../actions/ClipActions';

export default {
  path: ['/s/:slug'],

  async action(context) {
    const clip = context.params.slug;
    await ClipActions.fetchPrimary(clip);
    return <Search />;
  },
};
