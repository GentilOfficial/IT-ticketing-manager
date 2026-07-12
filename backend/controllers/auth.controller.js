const User = require('../models/User')
const { generateToken } = require('../utils/generateToken')
const {
  MissingFields,
  InvalidCredentials,
  AuthenticatedUserNotFound,
  SessionExpired,
  EmailAlreadyRegistered,
  OAuthOnlyAccount,
} = require('../utils/HttpError')
const { sendSuccess } = require('../utils/responses')

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new MissingFields()
    }

    if (await User.findOne({ email })) {
      throw new EmailAlreadyRegistered()
    }

    const adminExists = await User.exists({ role: 'admin' })

    const user = new User({ name, email, password, role: adminExists ? 'user' : 'admin' })
    await user.save()

    const token = generateToken(user)

    req.session.user_id = user.id

    return sendSuccess(res, { token }, 201)
  } catch (e) {
    return next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new MissingFields()
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      throw new InvalidCredentials()
    }

    if (!user.isLocal()) {
      throw new OAuthOnlyAccount()
    }

    const validPassword = await user.comparePassword(password)

    if (!validPassword) {
      throw new InvalidCredentials()
    }

    const token = generateToken(user)

    req.session.user_id = user.id

    return sendSuccess(res, { token })
  } catch (e) {
    return next(e)
  }
}

const refresh = async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw new SessionExpired()
    }

    const user = await User.findById(req.session.user_id)

    if (!user) {
      throw new AuthenticatedUserNotFound()
    }

    const token = generateToken(user)

    return sendSuccess(res, { token })
  } catch (e) {
    return next(e)
  }
}

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    sendSuccess(res)
  })
}

const handleGoogleCallback = async (req, res, next) => {
  try {
    const { user } = req

    if (!user) {
      throw new AuthenticatedUserNotFound()
    }

    const token = generateToken(user)

    req.session.user_id = user.id

    return res.redirect(
      `${process.env.FRONTEND_ORIGIN}${process.env.FRONTEND_OAUTH_CALLBACK_PATH}?token=${encodeURIComponent(token)}`,
    )
  } catch (e) {
    return next(e)
  }
}

const oauthErrorRedirect = (err, req, res, next) => {
  if (!err) {
    return next()
  }

  const message = err.message || 'OAuth authentication failed.'
  return res.redirect(
    `${process.env.FRONTEND_ORIGIN}${process.env.FRONTEND_LOGIN_PATH}?error=${encodeURIComponent(message)}`,
  )
}

module.exports = { register, login, refresh, logout, handleGoogleCallback, oauthErrorRedirect }
