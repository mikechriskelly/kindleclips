import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User, UserLogin, UserClaim, UserProfile } from './api/models';
import { auth as config } from './config';

/**
 * Sign in with Facebook.
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.id,
      clientSecret: config.facebook.secret,
      callbackURL: '/login/facebook/return',
      profileFields: [
        'displayName',
        'name',
        'email',
        'link',
        'locale',
        'timezone',
      ],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      /* eslint-disable no-underscore-dangle */
      const loginName = 'facebook';
      const claimType = 'urn:facebook:access_token';
      const fooBar = async () => {
        if (req.user) {
          // AUTHORIZATION: User is already logged in. Validate or connect accounts.
          const userLogin = await UserLogin.findOne({
            attributes: ['name', 'key'],
            where: { name: loginName, key: profile.id },
          });
          if (userLogin) {
            done(null, {
              id: req.user.id,
              email: profile._json.email,
            });
          } else {
            const user = await User.create(
              {
                id: req.user.id,
                email: profile._json.email,
                logins: [{ name: loginName, key: profile.id }],
                claims: [{ type: claimType, value: profile.id }],
                profile: {
                  displayName: profile.displayName,
                  gender: profile._json.gender,
                  picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                },
              },
              {
                include: [
                  { model: UserLogin, as: 'logins' },
                  { model: UserClaim, as: 'claims' },
                  { model: UserProfile, as: 'profile' },
                ],
              },
            );
            done(null, {
              id: user.id,
              email: user.email,
            });
          }
        } else {
          // AUTHENTICATION: User is logging in or signing up
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
          if (users.length) {
            // LOGIN
            const user = users[0].get({ plain: true });
            done(null, user);
          } else {
            // SIGNUP
            let user = await User.findOne({
              where: { email: profile._json.email },
            });
            if (user) {
              // There is already an account using this email address. Sign in to
              // that account and link it with Facebook manually from Account Settings.
              done(null, {
                id: user.id,
                email: user.email,
              });
            } else {
              user = await User.create(
                {
                  email: profile._json.email,
                  emailConfirmed: true,
                  logins: [{ name: loginName, key: profile.id }],
                  claims: [{ type: claimType, value: accessToken }],
                  profile: {
                    displayName: profile.displayName,
                    gender: profile._json.gender,
                    picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                  },
                },
                {
                  include: [
                    { model: UserLogin, as: 'logins' },
                    { model: UserClaim, as: 'claims' },
                    { model: UserProfile, as: 'profile' },
                  ],
                },
              );
              done(null, {
                id: user.id,
                email: user.email,
              });
            }
          }
        }
      };

      fooBar().catch(done);
    },
  ),
);

/**
 * Sign in with Google.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.id,
      clientSecret: config.google.secret,
      callbackURL: '/login/google/return',
      profileFields: ['name', 'email'],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      /* eslint-disable no-underscore-dangle */
      const loginName = 'google';
      const claimType = 'urn:google:access_token';
      const fooBar = async () => {
        if (req.user) {
          // AUTHORIZATION: User is already logged in. Validate or connect accounts.
          const userLogin = await UserLogin.findOne({
            attributes: ['name', 'key'],
            where: { name: loginName, key: profile.id },
          });
          if (userLogin) {
            done(null, {
              id: req.user.id,
              email: profile._json.email,
            });
          } else {
            const user = await User.create(
              {
                id: req.user.id,
                email: profile.emails[0].value,
                logins: [{ name: loginName, key: profile.id }],
                claims: [{ type: claimType, value: profile.id }],
                profile: {
                  displayName: profile.displayName,
                  gender: profile._json.gender,
                  picture: profile.photos[0] ? profile.photos[0].value : null,
                },
              },
              {
                include: [
                  { model: UserLogin, as: 'logins' },
                  { model: UserClaim, as: 'claims' },
                  { model: UserProfile, as: 'profile' },
                ],
              },
            );
            done(null, {
              id: user.id,
              email: user.email,
            });
          }
        } else {
          // AUTHENTICATION: User is logging in or signing up
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
          if (users.length) {
            // LOGIN
            const user = users[0].get({ plain: true });
            done(null, user);
          } else {
            // SIGNUP
            let user = await User.findOne({
              where: { email: profile._json.email },
            });
            if (user) {
              // There is already an account using this email address. Sign in to
              // that account and link it with Facebook manually from Account Settings.
              done(null, {
                id: user.id,
                email: user.email,
              });
            } else {
              user = await User.create(
                {
                  email: profile.emails[0] ? profile.emails[0].value : null,
                  emailConfirmed: true,
                  logins: [{ name: loginName, key: profile.id }],
                  claims: [{ type: claimType, value: accessToken }],
                  profile: {
                    displayName: profile.displayName,
                    gender: profile._json.gender,
                    picture: profile.photos[0] ? profile.photos[0].value : null,
                  },
                },
                {
                  include: [
                    { model: UserLogin, as: 'logins' },
                    { model: UserClaim, as: 'claims' },
                    { model: UserProfile, as: 'profile' },
                  ],
                },
              );
              done(null, {
                id: user.id,
                email: user.email,
              });
            }
          }
        }
      };

      fooBar().catch(done);
    },
  ),
);

export default passport;
