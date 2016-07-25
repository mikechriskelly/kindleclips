import React from 'react';
import Home from './Home';
import ClipActions from '../../actions/ClipActions';

export default {

  path: ['/', '/random'],

  async action() {
    await ClipActions.fetchAll();
    return <Home />;
  },

};
