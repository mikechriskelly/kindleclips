import jwt from 'jsonwebtoken';
import { auth, demoUser } from '../config';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

function getToken(req) {
  let token = null;
  if (req && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req && req.cookies.id_token) {
    token = req.cookies.id_token;
  } else {
    token = UserStore.getToken();
  }
  return token;
}

function getID() {
  try {
    // Lookup a verified user ID
    const token = getToken();
    const secret = auth.jwt.secret;
    const decrypted = jwt.verify(token, secret);
    return decrypted.id;
  } catch (err) {
    console.log('Using demo clips');
    // Or else use the demo ID
    return demoUser.id;
  }
}

function authenticateUser(req, res) {
  // Create token
  const expiresIn = 60 * 60 * 24 * 180; // 180 days
  const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });

  // Save token as cookie and in store
  res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: false });
  UserActions.login(token);

  return res.redirect('/');
}

function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
}

export { getToken, getID, authenticateUser, ensureAuthentication };
