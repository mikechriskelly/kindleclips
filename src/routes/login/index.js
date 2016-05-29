import React from 'react';
import Login from './Login';

export default {

  path: ['/login', '/register'],

  action() {
    return <Login />;
  },

};
