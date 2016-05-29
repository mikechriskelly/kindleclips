import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User, UserLogin, UserClaim, UserProfile } from '../data/models';
import { auth as config } from '../config';

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: config.facebook.id,
  clientSecret: config.facebook.secret,
  callbackURL: '/login/facebook/return',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  /* eslint-disable no-underscore-dangle */
  const loginName = 'facebook';
  const claimType = 'urn:facebook:access_token';
  const fooBar = async () => {
    console.log('profile: ', profile);
    // AUTHORIZATION: User is already logged in and is connecting accounts.
    if (req.user) {
      const userLogin = await UserLogin.findOne({
        attributes: ['name', 'key'],
        where: { name: loginName, key: profile.id },
      });
      if (userLogin) {
        // There is already a Facebook account that belongs to you.
        // Sign in with that account or delete it, then link it with your current account.
        console.log('You already have a Facebook login associated with your email address');
        done(null, false, { message: 'Already account with Facebook' });
      } else {
        console.log('Associating this Google account with your existing account');
        const user = await User.create({
          id: req.user.id,
          email: profile._json.email,
          logins: [
            { name: loginName, key: profile.id },
          ],
          claims: [
            { type: claimType, value: profile.id },
          ],
          profile: {
            displayName: profile.displayName,
            gender: profile._json.gender,
            picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
          },
        }, {
          include: [
            { model: UserLogin, as: 'logins' },
            { model: UserClaim, as: 'claims' },
            { model: UserProfile, as: 'profile' },
          ],
        });
        done(null, {
          id: user.id,
          email: user.email,
        });
      }
    // AUTHENTICATION: User is logging in or signing up
    } else {
      const users = await User.findAll({
        attributes: ['id', 'email'],
        where: { '$logins.name$': loginName, '$logins.key$': profile.id },
        include: [
          {
            attributes: ['name', 'key'],
            model: UserLogin,
            as: 'logins',
            required: true,
          },
        ],
      });
      // LOGIN
      if (users.length) {
        console.log('Logging in');
        done(null, users[0]);
      // SIGNUP
      } else {
        let user = await User.findOne({ where: { email: profile._json.email } });
        if (user) {
          // There is already an account using this email address. Sign in to
          // that account and link it with Facebook manually from Account Settings.
          console.log('You already have an account with this email address');
          done(null, false, { message: 'Already account with this email address' });
        } else {
          user = await User.create({
            email: profile._json.email,
            emailVerified: true,
            logins: [
              { name: loginName, key: profile.id },
            ],
            claims: [
              { type: claimType, value: accessToken },
            ],
            profile: {
              displaynName: profile.displayName,
              gender: profile._json.gender,
              picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
            },
          }, {
            include: [
              { model: UserLogin, as: 'logins' },
              { model: UserClaim, as: 'claims' },
              { model: UserProfile, as: 'profile' },
            ],
          });
          done(null, {
            id: user.id,
            email: user.email,
          });
        }
      }
    }
  };

  fooBar().catch(done);
}));

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
  clientID: config.google.id,
  clientSecret: config.google.secret,
  callbackURL: '/login/google/return',
  profileFields: ['name', 'email'],
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  const loginName = 'google';
  const claimType = 'urn:google:access_token';
  const fooBar = async () => {
    // AUTHORIZATION: User is already logged in and is connecting accounts.
    if (req.user) {
      const userLogin = await UserLogin.findOne({
        attributes: ['name', 'key'],
        where: { name: loginName, key: profile.id },
      });
      if (userLogin) {
        // There is already a Google account that belongs to you.
        // Sign in with that account or delete it, then link it with your current account.
        console.log('You already have a Google login associated with your email address');
        done(null, {
          id: req.user.id,
          email: req.user.email,
        });
      } else {
        console.log('Associating this Google account with your existing account');
        const user = await User.create({
          id: req.user.id,
          email: profile.emails[0].value,
          logins: [
            { name: loginName, key: profile.id },
          ],
          claims: [
            { type: claimType, value: profile.id },
          ],
          profile: {
            displayName: profile.displayName,
            picture: profile.photos[0] ? profile.photos[0].value : null,
            gender: profile.gender,
          },
        }, {
          include: [
            { model: UserLogin, as: 'logins' },
            { model: UserClaim, as: 'claims' },
            { model: UserProfile, as: 'profile' },
          ],
        });
        done(null, {
          id: user.id,
          email: user.email,
        });
      }
    // AUTHENTICATION: User is logging in or signing up
    } else {
      const users = await User.findAll({
        attributes: ['id', 'email'],
        where: { '$logins.name$': loginName, '$logins.key$': profile.id },
        include: [
          {
            attributes: ['name', 'key'],
            model: UserLogin,
            as: 'logins',
            required: true,
          },
        ],
      });
      // LOGIN
      if (users.length) {
        console.log('Logging in');
        done(null, {
          id: users[0].dataValues.id,
          email: users[0].dataValues.email,
        });
      // SIGNUP
      } else {
        let user = await User.findOne({ where: { email: profile.emails[0].value } });
        if (user) {
          // There is already an account using this email address. Sign in to
          // that account and link it with Google manually from Account Settings.
          console.log('You already have an account with this email address');
          done(null, false, { message: 'Already account with this email address' });
        // Create a new account
        } else {
          user = await User.create({
            email: profile.emails[0] ? profile.emails[0].value : null,
            emailVerified: true,
            logins: [
              { name: loginName, key: profile.id },
            ],
            claims: [
              { type: claimType, value: accessToken },
            ],
            profile: {
              displayName: profile.displayName,
              picture: profile.photos[0] ? profile.photos[0].value : null,
              gender: profile.gender,
            },
          }, {
            include: [
              { model: UserLogin, as: 'logins' },
              { model: UserClaim, as: 'claims' },
              { model: UserProfile, as: 'profile' },
            ],
          });
          done(null, {
            id: user.id,
            email: user.email,
          });
        }
      }
    }
  };
  fooBar().catch(done);
}));

export default passport;
