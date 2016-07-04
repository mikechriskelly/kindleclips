import React from 'react';
import Upload from './Upload';

export default {

  path: ['/upload', '/uploading'],

  action({ path }) { // eslint-disable-line react/prop-types
    const isLoading = (path === '/uploading');
    return <Upload isLoading={isLoading} />;
  },

};
