import jwt from 'jsonwebtoken';
import { auth } from '../config';

function getToken(req) {
  let token = null;
  if (req && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req && req.cookies.token) {
    token = req.cookies.token;
  }
  return token;
}

function getID(token) {
  try {
    const secret = auth.jwt.secret;
    const decrypted = jwt.verify(token, secret);
    return decrypted.id;
  } catch (err) {
    console.log('Failed to get ID: ', err);
    return null;
  }
}

function loginUser(req, res) {
  // Create token
  const expiresIn = 60 * 60 * 24 * 180; // 180 days
  const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });

  // Save token as cookie and in store
  res.cookie('token', token, { maxAge: 1000 * expiresIn, httpOnly: false, path: '/' });
  return res.redirect('/');
}

function protectRoute(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
}

export { getToken, getID, loginUser, protectRoute };
