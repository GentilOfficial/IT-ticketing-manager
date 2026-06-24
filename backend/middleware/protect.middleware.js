const { verify, JsonWebTokenError } = require('jsonwebtoken')
const { InvalidToken, MissingToken } = require('../utils/HttpError')

const PUBLIC_ROUTES = [
  { path: '/api/auth/register', method: 'POST' },
  { path: '/api/auth/login', method: 'POST' },
]

const protectRoutes = async (req, res, next) => {
  const isPublicRoute = PUBLIC_ROUTES.some((route) => route.path === req.path && route.method === req.method)

  if (isPublicRoute) return next()

  try {
    const token = req.headers['authorization']

    if (!token) {
      throw new MissingToken()
    }

    req.jwtUser = verify(token, process.env.JWT_SIGN_SECRET)

    return next()
  } catch (e) {
    if (e instanceof JsonWebTokenError) return next(new InvalidToken())
    return next(e)
  }
}

module.exports = { protectRoutes }
