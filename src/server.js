import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import ReactDOM from 'react-dom/server';
import { match } from 'universal-router';
import PrettyError from 'pretty-error';
import multer from 'multer';
import passport from './core/passport';
import { sync, User } from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { port, auth, analytics, mondgodbUrl } from './config';
// import { exec } from 'child_process';
// import fs from 'fs';
import { insertClips, removeClips } from './data/queries/clips';
import UserActions from './actions/UserActions';

const server = express();

// Connect to MongoDB
// -----------------------------------------------------------------------------
const connect = () => {
  mongoose.connect(mondgodbUrl, (err) => {
    if (err) {
      console.log(`Error connecting to: ${mondgodbUrl} ${err}`);
    } else {
      console.log(`Successful connecting to ${mondgodbUrl}`);
    }
  });
};

connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
const getToken = req => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.id_token) {
    token = req.cookies.id_token;
  }
  return token;
};

server.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken,
}));
server.use(passport.initialize());

const authenticateUser = (req, res) => {
  const expiresIn = 60 * 60 * 24 * 180; // 180 days
  const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
  res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
  UserActions.loginUser(token);
  return res.redirect('/home');
};

const ensureAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect(401, '/');
  }
};

server.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email'], session: false })
);

server.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/', session: false }),
  authenticateUser
);

server.get('/login/google',
  passport.authenticate('google', { scope: ['email'], session: false })
);

server.get('/login/google/return',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  authenticateUser
);

server.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('id_token');
  res.redirect('/');
});

//
// API for User Actions
// -----------------------------------------------------------------------------
// Require authentication for all API endpoints
server.all('/api/*', ensureAuthentication, async (req, res, next) => {
  next(); // Passed auth check, so continue
});

server.get('/api/user/showtoken', async (req, res) => {
  res.end(`
    User ID: ${req.user.id}
    Token: ${getToken(req)}
  `);
});

server.get('/api/user/delete', async (req, res) => {
  const removedUser = await User.destroy({ where: { id: req.user.id } });
  if (removedUser) {
    res.redirect('/logout');
  } else {
    res.redirect('/');
  }
});

server.post('/api/clips/upload',
  multer({
    storage: multer.memoryStorage(),
    limits: { files: 1, fileSize: 5000000 },
  }).single('myClippingsTxt'), async (req, res, next) => {
    try {
      const fullString = req.file.buffer.toString('utf8');
      insertClips(fullString, req.user.id);
      res.end('Clips added for user');
    } catch (err) {
      next(err);
    }
  }
);

server.get('/api/clips/remove', async (req, res) => {
  removeClips(req.user.id);
  res.end('All clips removed for this user');
});

//
// Launch Data Analysis Process
// -----------------------------------------------------------------------------
// Make the R script executable for node (octal 0755 = decimal 493)
// fs.chmod('build/analysis/LDA.r', 493, (err) => {
//   if (err) throw err;
// });

// exec('build/analysis/LDA.r', (error, stdout, stderr) => {
//   console.log('stdout: ', stdout);
//   console.log('stderr: ', stderr);
//   if (error !== null) {
//     console.log('exec error: ', error);
//   }
// });

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {
    let css = [];
    let statusCode = 200;
    const template = require('./views/index.jade'); // eslint-disable-line global-require
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };

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

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
sync().catch(err => console.error(err.stack)).then(() => {
  server.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
