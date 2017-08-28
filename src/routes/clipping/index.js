import React from 'react';
import Clipping from './Clipping';
// import ClipActions from '../../actions/ClipActions';

export default {
  path: '/c/:slug',

  async action(context) {
    const slug = context.params.slug;
    // const clip = await ClipActions.fetchPrimary(slug);
    const clip = {};
    if (clip.id) {
      return <Clipping {...clip} />;
    }
  },
};
