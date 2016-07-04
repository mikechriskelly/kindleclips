import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ReactDOM from 'react-dom/server';
import { match } from 'universal-router';
import PrettyError from 'pretty-error';
import passport from './core/passport';
import { syncDatabase, User, UserLogin, UserProfile } from './api/models';
import pg from 'pg';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { port, analytics, demoUser, databaseUrl } from './config';
import { loginUser } from './api/auth';
import apiRoutes from './api/routes.js';
import cookie from 'react-cookie';
import alt from './core/alt';
import fs from 'fs';

/* eslint-disable no-console */

const server = express();

// Tell CSS tooling to use all vendor prefixes if user agent is not known
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

// Register Node.js middleware
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Connect to PostgreSQL
// Use SSL if DB is not local
pg.defaults.ssl = !!process.env.DATABASE_URL;
pg.connect(databaseUrl, (err) => {
  if (err) throw err;
  console.log('Connected to Postgres');
});

// Create demo user if it doesn't already exist
async function setupDemoUser() {
  const existingUser = await User.findOne({
    attributes: ['id'],
    where: { id: demoUser.id },
  });
  if (!existingUser) {
    await User.create({
      id: demoUser.id,
      email: demoUser.email,
      emailConfirmed: true,
      logins: [
        { name: 'none', key: demoUser.loginKey },
      ],
      profile: {
        displayName: demoUser.displayName,
        gender: null,
        picture: null,
      },
    }, {
      include: [
        { model: UserLogin, as: 'logins' },
        { model: UserProfile, as: 'profile' },
      ],
    });
  }
}
if (process.env.NODE_ENV !== 'production') { setupDemoUser(); }


// Authentication Routes
server.use(passport.initialize());

server.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email'], session: false })
);

server.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/', session: false }),
  loginUser
);

server.get('/login/google',
  passport.authenticate('google', { scope: ['email'], session: false })
);

server.get('/login/google/return',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  loginUser
);

server.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('token');
  res.redirect('/');
});

// API Routes
server.use(apiRoutes);


// Make LDA script executable
fs.chmod('analysis/LDA.R', 493, (err) => {
  if (err) throw err;
});


// Register server-side rendering middleware
server.get('*', async (req, res, next) => {
  try {
    let css = [];
    let statusCode = 200;
    const template = require('./views/index.jade'); // eslint-disable-line global-require
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };

    cookie.plugToRequest(req, res);

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    await match(routes, {
      path: req.path,
      query: req.query,
      context: {
        insertCss: styles => css.push(styles._getCss()), // eslint-disable-line no-underscore-dangle
        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      },
      render(component, status = 200) {
        css = [];
        statusCode = status;
        data.body = ReactDOM.renderToString(component);
        data.css = css.join('');
        return true;
      },
    });

    res.status(statusCode);
    res.send(template(data));
    alt.flush();
  } catch (err) {
    next(err);
  }
});

// Error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const template = require('./views/error.jade'); // eslint-disable-line global-require
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  }));
});

// Sync models with DB and then launch server
syncDatabase()
  .catch(err => console.error(err.stack))
  .then(() => {
    server.listen(port, () => { console.log(`The server is running at http://localhost:${port}/`) });
  });
