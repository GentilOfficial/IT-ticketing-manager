const express = require('express')
const userRoutes = express.Router()
const userController = require('../controllers/user.controller')
const { adminOnly, requireUserAccess } = require('../middleware/authorized.middleware')
const { validateUserUpdate } = require('../middleware/validation/rules/user.validation')

userRoutes.get('/me', userController.loggedUser)
userRoutes.get('/all', adminOnly, userController.allUsers)
userRoutes.get('/admin', adminOnly, userController.adminUsers)
userRoutes.put('/:id', [validateUserUpdate, requireUserAccess], userController.editUser)

module.exports = { userRoutes }
