import React from 'react';
import Home from './Home';
import ClipActions from '../../actions/ClipActions';

export default {

  path: '/',

  async action() {
    const clips = await ClipActions.fetch();
    return <Home clips={clips} />;
  },

};
