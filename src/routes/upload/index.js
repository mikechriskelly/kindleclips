import React from 'react';
import Upload from './Upload';

export default {
  path: ['/upload', '/uploading'],

  // eslint-disable-next-line react/prop-types
  action({ path }) {
    const isLoading = path === '/uploading';
    return <Upload isLoading={isLoading} />;
  },
};
