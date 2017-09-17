/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/',
  children: [
    {
      path: ['/', '/c/:slug'],
      load: () => import(/* webpackChunkName: 'clipping' */ './clipping'),
    },
    {
      path: ['/s', '/s/:searchterm'],
      load: () => import(/* webpackChunkName: 'search' */ './search'),
    },
    {
      path: '/about',
      load: () => import(/* webpackChunkName: 'about' */ './about'),
    },
    {
      path: '/login',
      load: () => import(/* webpackChunkName: 'login' */ './login'),
    },
    {
      path: '/upload',
      load: () => import(/* webpackChunkName: 'upload' */ './upload'),
    },

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '*',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Kindle Clips'}`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
