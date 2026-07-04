const express = require('express')
const router = express.Router()

const { apiLimiter, authLimiter } = require('../config/limiter')

const { authRoutes } = require('./auth.routes')
const { ticketRoutes } = require('./ticket.routes')
const { userRoutes } = require('./user.routes')

router.use('/auth', authLimiter, authRoutes)
router.use('/tickets', apiLimiter, ticketRoutes)
router.use('/users', apiLimiter, userRoutes)

module.exports = { router }
