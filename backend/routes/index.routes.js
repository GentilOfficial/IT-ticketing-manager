const express = require('express')
const router = express.Router()

const { authRoutes } = require('./auth.routes')
const { ticketRoutes } = require('./ticket.routes')
const { userRoutes } = require('./user.routes')

router.use('/auth', authRoutes)
router.use('/tickets', ticketRoutes)
router.use('/users', userRoutes)

module.exports = { router }
