const express = require('express')
const authRoutes = express.Router()
const authController = require('../controllers/auth.controller')

authRoutes.post('/register', authController.register)
authRoutes.post('/login', authController.login)
authRoutes.get('/me', authController.loggedUser)

module.exports = { authRoutes }
