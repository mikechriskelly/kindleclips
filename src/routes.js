import React from 'react';
import ClipPage from './containers/ClipPage';
import ErrorPage from './components/ErrorPage';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './components/LoginPage';
import Page from './components/Page';
import UploadPage from './containers/UploadPage';
import SearchPage from './containers/SearchPage';
import about from './../public/about.md';
import { fetchClip, fetchRandomClip, searchClips } from './modules/clips';

const routes = {
  path: '/',
  children: [
    {
      // CLIP
      path: ['/', '/c/:shortId'],
      async action({ store }, { shortId }) {
        store.dispatch(fetchClip(shortId));
        return {
          title: 'Clip',
          component: <ClipPage />,
        };
      },
    },
    {
      // RANDOM
      path: ['/random'],
      async action({ store }) {
        store.dispatch(fetchRandomClip());
        return {
          title: 'Clip',
          component: <ClipPage />,
        };
      },
    },
    {
      // SEARCH
      path: [
        '/s',
        '/s/:searchPhrase',
        '/author/:searchAuthor',
        '/title/:searchTitle',
      ],
      async action({ store }, { searchPhrase, searchAuthor, searchTitle }) {
        const searchTerm = searchPhrase || searchAuthor || searchTitle;
        store.dispatch(searchClips(searchTerm));
        return {
          title: 'Search Results',
          component: <SearchPage isHighlighted={!!searchPhrase} />,
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
        return {
          title: 'Upload',
          component: <UploadPage />,
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
