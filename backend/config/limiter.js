const { rateLimit } = require('express-rate-limit')
const { TooManyRequests } = require('../utils/HttpError')

const limiterConfig = {
  standardHeaders: 'draft-8',
  ipv6Subnet: 56,
  handler: (req, res, next) => {
    next(new TooManyRequests())
  },
}

const apiLimiter = rateLimit({
  ...limiterConfig,
  windowMs: process.env.API_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  limit: process.env.API_RATE_LIMIT_MAX_REQUESTS * 1,
})

const authLimiter = rateLimit({
  ...limiterConfig,
  windowMs: process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  limit: process.env.AUTH_RATE_LIMIT_MAX_REQUESTS * 1,
})

module.exports = { apiLimiter, authLimiter }
