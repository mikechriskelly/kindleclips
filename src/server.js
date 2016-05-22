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
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets';
import { port, auth, analytics, mondgodbUrl } from './config';
import { exec } from 'child_process';
import fs from 'fs';
import insertClippings from './data/queries/insertClippings';

/* eslint-disable no-console */

const app = express();

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
  getToken: req => req.cookies.id_token,
  /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
}));
app.use(passport.initialize());

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
);
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  }
);

app.get('/login/google',
  passport.authenticate('google', { scope: ['email'], session: false })
);
app.get('/login/google/return',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  }
);


//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    let css = [];
    let statusCode = 200;
    const template = require('./views/index.jade');
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    await match(routes, {
      path: req.path,
      query: req.query,
      context: {
        insertCss: styles => css.push(styles._getCss()),
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
// Uploading
// -----------------------------------------------------------------------------
const options = {
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: 5000000 },
};

app.post('/upload', multer(options).single('myClippingsText'), async (req, res, next) => {
  try {
    const clippingsString = req.file.buffer.toString('utf8');
    insertClippings(clippingsString);
    res.end('Success');
  } catch (err) {
    next(err);
  }
});

// Make the R script executable for node (octal 0755 = decimal 493)
fs.chmod('build/analysis/LDA.r', 493, (err) => {
  if (err) throw err;
});

// exec('build/analysis/LDA.r', (error, stdout, stderr) => {
//   console.log('stdout: ', stdout);
//   console.log('stderr: ', stderr);
//   if (error !== null) {
//     console.log('exec error: ', error);
//   }
// });

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const template = require('./views/error.jade');
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
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
