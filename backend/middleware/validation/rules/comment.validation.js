const { body } = require('express-validator')
const { validateRequest } = require('../validation.middleware')

const validateCommentCreate = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage('Comment message must be between 1 and 400 characters'),
  validateRequest,
]

module.exports = { validateCommentCreate }
