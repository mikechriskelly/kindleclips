import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';

export default {

  path: '/home',

  async action() {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{clippings{id,title,author,text}}',
      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (!data || !data.clippings) throw new Error('Failed to load clippings.');
    return <Home clippings={data.clippings} />;
  },

};
