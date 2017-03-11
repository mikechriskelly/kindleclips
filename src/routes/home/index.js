import React from 'react';
import Home from './Home';
import Clipping from '../c/Clipping';
import ClipActions from '../../actions/ClipActions';
import UserStore from '../../stores/UserStore';

export default {

  path: '/',

  async action() {
    const randClipSlug = await ClipActions.getRandomSlug(true);

    // If user already logged in, then forward to a specific clip
    if (await UserStore.isLoggedIn()) {
      const clip = await ClipActions.fetchPrimary(null, true);
      return <Clipping {...clip} />;
    }

    return <Home randClipSlug={randClipSlug} />;
  },

};
