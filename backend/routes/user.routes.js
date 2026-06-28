const express = require('express')
const userRoutes = express.Router()
const userController = require('../controllers/user.controller')
const { authorizedUser } = require('../middleware/authorized.middleware')

userRoutes.use(authorizedUser)
userRoutes.get('/all', userController.allUsers)
userRoutes.get('/admin', userController.adminUsers)

module.exports = { userRoutes }
