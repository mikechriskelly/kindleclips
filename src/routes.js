import React from 'react';
import ClipPage from './components/ClipPage';
import ErrorPage from './components/ErrorPage';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './components/LoginPage';
import Page from './components/Page';
import UploadPage from './components/UploadPage';
import SearchPage from './components/SearchPage';
import about from './../public/about.md';
import { fetchRandomClip } from './modules/clips';

const routes = {
  path: '/',
  children: [
    {
      // CLIP
      path: ['/', '/c/:slug'],
      async action({ store }) {
        await store.dispatch(fetchRandomClip());
        const clip = {}; // TODO: Data fetch e.g. await ClipActions.fetchPrimary(slug);
        return {
          title: 'Clip',
          component: <ClipPage {...clip} />,
        };
      },
    },
    {
      // SEARCH
      path: ['/s', '/s/:searchterm'],
      action() {
        const searchTerm = ''; // TODO: Insert from URL
        const clips = {}; // TODO: Data Fetch e.g. await ClipActions.fetchMatching(searchTerm);
        return {
          chunks: ['search'],
          title: 'Search Results',
          component: <SearchPage searchTerm={searchTerm} results={clips} />,
        };
      },
    },
    {
      // ABOUT
      path: '/about',
      action() {
        return {
          title: 'About',
          component: <Page {...about} />,
        };
      },
    },
    {
      // LOGIN
      path: '/login',
      action() {
        return {
          title: 'About',
          component: <LoginPage />,
        };
      },
    },
    {
      // UPLOAD
      path: '/upload',
      action() {
        const title = 'Upload';
        const isLoading = false; // TODO: Tack loading state
        return {
          title: 'Upload',
          component: <UploadPage title={title} isLoading={isLoading} />,
        };
      },
    },
    {
      // NOT FOUND
      path: '*',
      action() {
        return {
          title: 'Page Not Found',
          component: <NotFoundPage />,
        };
      },
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = route.title
      ? `${route.title} - Kindle Clips`
      : 'Kindle Clips';
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action() {
      return {
        title: 'Demo Error',
        component: <ErrorPage />,
      };
    },
  });
}

export default routes;
