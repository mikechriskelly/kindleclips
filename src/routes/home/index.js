import React from 'react';
import Home from './Home';
import SearchActions from '../../actions/SearchActions';

export default {

  path: '/',

  async action() {
    const clips = await SearchActions.initialFetch();
    return <Home clips={[]} />;
  },

};
