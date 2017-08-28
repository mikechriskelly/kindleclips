import React from 'react';
import App from '../components/App';

// Child routes
import content from './content';
import clipping from './clipping';
import login from './login';
import upload from './upload';
import error from './error';

export default {
  path: '/',

  children: [
    content, // root and search routes
    clipping, // single clipping route
    login,
    upload,
    error,
  ],

  async action({ render, next, context }) {
    const component = await next();
    if (component === undefined) return component;
    return render(
      <App context={context}>
        {component}
      </App>,
    );
  },
};
