const { body } = require('express-validator')
const { validateRequest } = require('../validation.middleware')

const validateUserUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
  validateRequest,
]

module.exports = { validateUserUpdate }
