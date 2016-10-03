import React from 'react';
import Home from './Home';
import ClipActions from '../../actions/ClipActions';

export default {

  path: ['/', '/clip', '/clip/:slug'],

  async action(context) {
    const clip = context.params.slug || null;
    await ClipActions.fetchPrimary(clip, true);
    return <Home />;
  },

};
