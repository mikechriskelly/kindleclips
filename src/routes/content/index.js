import React from 'react';
import Content from './Content';
// import Clipping from '../clipping/Clipping';
// import Search from '../search/Search';
// import ClipActions from '../../actions/ClipActions';
// import UserStore from '../../stores/UserStore';

export default {
  path: ['/', '/s', '/s/:slug'],

  async action(context) {
    // const searchTerm = context.params.slug;

    // if (await UserStore.isLoggedIn()) {
    //   if (searchTerm) {
    //     const clips = await ClipActions.fetchMatching(searchTerm);
    //     return <Search searchTerm={searchTerm} results={clips} />;
    //   }

    //   const clip = await ClipActions.fetchPrimary();
    //   return <Clipping {...clip} />;
    // }

    // const clip = await ClipActions.fetchPrimary();
    const clip = {};
    return <Content id={clip.id} />;
  },
};
