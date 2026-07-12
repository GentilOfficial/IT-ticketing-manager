const express = require('express')
const authRoutes = express.Router()
const { passport } = require('../config/passport')
const authController = require('../controllers/auth.controller')
const { validateRegister, validateLogin } = require('../middleware/validation/rules/auth.validation')

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN

authRoutes.post('/register', validateRegister, authController.register)
authRoutes.post('/login', validateLogin, authController.login)
authRoutes.post('/refresh', authController.refresh)
authRoutes.post('/logout', authController.logout)
authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
authRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${FRONTEND_ORIGIN}${process.env.FRONTEND_LOGIN_PATH}?error=google`,
  }),
  authController.handleGoogleCallback,
  authController.oauthErrorRedirect,
)

module.exports = { authRoutes }
