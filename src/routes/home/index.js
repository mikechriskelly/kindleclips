import React from 'react';
import Home from './Home';
import ClipActions from '../../actions/ClipActions';

export default {

  path: ['/', '/clip', '/clip/:slug'],

  async action(context) {
    const clip = context.params.slug || await ClipActions.getRandomSlug(true);

    await ClipActions.fetchPrimary(clip);
    return <Home />;
  },

};
