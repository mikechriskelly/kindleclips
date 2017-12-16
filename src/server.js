import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import expressGraphQL from 'express-graphql';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import PrettyError from 'pretty-error';
import pg from 'pg';
import App from './components/App';
import Html from './components/Html';
import ErrorPage from './components/ErrorPage';
import createFetch from './createFetch';
import passport from './passport';
import router from './router';
import { User, UserLogin, UserProfile, sync } from './api/models';
import schema from './api/schema';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import config from './config';
import { loginUser } from './api/auth';
import apiRoutes from './api/routes';
import { initialState as clipsInitialState } from './modules/clips';
import { initialState as userInitialState } from './modules/user';

// Connect to PostgreSQL
// Use SSL if DB is not local
pg.defaults.ssl = !!process.env.DATABASE_URL;
const pgPool = new pg.Pool({ connectionString: config.db.url });
pgPool.connect(err => {
  if (err) throw err;
  console.info('Connected to Postgres');
});

// Create demo user if it doesn't already exist
async function setupDemoUser() {
  const existingUser = await User.findOne({
    attributes: ['id'],
    where: { id: config.demoUser.id },
  });
  if (!existingUser) {
    User.create(
      {
        id: config.demoUser.id,
        email: config.demoUser.email,
        emailConfirmed: true,
        logins: [{ name: 'none', key: config.demoUser.loginKey }],
        profile: {
          displayName: config.demoUser.displayName,
          gender: null,
          picture: null,
        },
      },
      {
        include: [
          { model: UserLogin, as: 'logins' },
          { model: UserProfile, as: 'profile' },
        ],
      },
    );
  }
}
if (process.env.NODE_ENV !== 'production') {
  setupDemoUser();
}

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}
app.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
    session: false,
  }),
);
app.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false,
  }),
  loginUser,
);

app.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['email'],
    session: false,
  }),
);
app.get(
  '/login/google/return',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  loginUser,
);

app.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('token');
  res.redirect('/');
});

// API Routes
app.use(apiRoutes);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    rootValue: { request: req },
    pretty: __DEV__,
  })),
);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    // Put user information in global state
    if (req.user) {
      req.user.isLoggedIn = true;
    }

    const initialState = {
      user: {
        ...userInitialState,
        ...req.user,
      },
      clips: clipsInitialState,
    };

    const store = configureStore(initialState, {
      fetch,
    });

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      fetch,
      store,
      storeSubscription: null,
    };

    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    // Styled Components style sheet
    const sheet = new ServerStyleSheet();

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <App context={context} store={store}>
          {route.component}
        </App>
      </StyleSheetManager>,
    );
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html title="Internal Server Error" description={err.message}>
      {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  // TODO: Remove the promise that syncs the DB
  promise.then(() => {
    module.hot.accept('./router');
  });
}

export default app;
