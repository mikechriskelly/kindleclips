export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const databaseUrl = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;
export const db = {
  url: databaseUrl,
  host: process.env.DATABASE_HOST || process.env.LOCAL_DATABASE_HOST,
  port: process.env.DATABASE_PORT || process.env.LOCAL_DATABASE_PORT || 5432,
  user: process.env.DATABASE_USER || process.env.LOCAL_DATABASE_USER,
  name: process.env.DATABASE_NAME || process.env.LOCAL_DATABASE_NAME,
  pw: process.env.DATABASE_PW || process.env.LOCAL_DATABASE_PW,
};

export const analytics = {
  google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X' },
};

export const demoUser = {
  id: '364deab3-b79c-4d02-aa2c-eebdeb0c45f4',
  email: 'mikechriskelly+kindleclips@gmail.com',
  displayName: 'Demo User',
  loginKey: '0',
};

export const auth = {

  jwt: { secret: process.env.JWT_SECRET },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_APP_SECRET,
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET,
  },

};
