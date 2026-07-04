const session = require('express-session')

const initSessionCookies = (server) => {
  server.set('trust proxy', 1)
  server.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: process.env.SESSION_TIMEOUT_MINUTES * 60 * 1000,
      },
    }),
  )
}

module.exports = { initSessionCookies }
