const express = require('express')
const authRoutes = express.Router()
const authController = require('../controllers/auth.controller')
const { validateRegister, validateLogin } = require('../middleware/validation/rules/auth.validation')

authRoutes.post('/register', validateRegister, authController.register)
authRoutes.post('/login', validateLogin, authController.login)
authRoutes.get('/me', authController.loggedUser)

module.exports = { authRoutes }
