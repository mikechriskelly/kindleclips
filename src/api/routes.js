import { Router } from 'express';
import expressGraphQL from 'express-graphql';
import multer from 'multer';
import schema from './schema';
import { insertClips, removeClips } from './queries/clips';
import User from './models/User';
import expressJwt from 'express-jwt';
import { auth } from '../config';
import { getToken, protectRoute } from './auth';

const server = Router();

server.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken,
}));

// Register API middleware
server.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

// Require authentication for all API endpoints
server.all('/api/*', protectRoute, async (req, res, next) => {
  next(); // Passed auth check, so continue
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

// Register API middleware
server.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

export default server;
