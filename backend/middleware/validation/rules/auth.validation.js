const { body } = require('express-validator')
const { validateRequest } = require('../validation.middleware')

const validateRegister = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),
  body('email').isEmail().trim().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9\s]/)
    .withMessage('Password must contain at least one special character')
    .not()
    .matches(/\s/)
    .withMessage('Password cannot contain spaces'),
  validateRequest,
]

const validateLogin = [
  body('email').isEmail().trim().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Required password'),
  validateRequest,
]

module.exports = { validateRegister, validateLogin }
