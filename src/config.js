export const port = process.env.PORT || 5000;

export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const googleAnalyticsId = 'UA-XXXXX-X';

export const db = 'mongodb://localhost/kindleclips';

export const sessionSecret = process.env.SESSION_SECRET || '';

export const google = {
  clientID: process.env.GOOGLE_CLIENTID || '',
  clientSecret: process.env.GOOGLE_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback',
};
