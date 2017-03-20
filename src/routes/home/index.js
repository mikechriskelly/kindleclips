import React from 'react';
import Home from './Home';
import Clipping from '../c/Clipping';
import ClipActions from '../../actions/ClipActions';
import UserStore from '../../stores/UserStore';
export default {

  path: '/',

  async action() {
    const clip = await ClipActions.fetchPrimary();
    // If user already logged in, then forward to a specific clip
    if (await UserStore.isLoggedIn()) {
      return <Clipping {...clip} />;
    }
    return <Home id={clip.id} />;
  },

};
