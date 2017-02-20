import React from 'react';
import Clipping from './Clipping';
import ClipActions from '../../actions/ClipActions';

export default {

  path: ['/c/:slug'],

  async action(context) {
    const id = context.params.slug;
    await ClipActions.fetchPrimary(id);
    return <Clipping id={id} />;
  },

};
