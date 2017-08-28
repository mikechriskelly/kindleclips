if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Database
  db: {
    url: process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL,
    host: process.env.DATABASE_HOST || process.env.LOCAL_DATABASE_HOST,
    port: process.env.DATABASE_PORT || process.env.LOCAL_DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || process.env.LOCAL_DATABASE_USER,
    name: process.env.DATABASE_NAME || process.env.LOCAL_DATABASE_NAME,
    pw: process.env.DATABASE_PW || process.env.LOCAL_DATABASE_PW,
  },

  // Demo User
  demoUser: {
    id: '364deab3-b79c-4d02-aa2c-eebdeb0c45f4',
    email: 'mikechriskelly+kindleclips@gmail.com',
    displayName: 'Demo User',
    loginKey: '0',
  },

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID,
  },

  // Authentication
  auth: {
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
  },
};
