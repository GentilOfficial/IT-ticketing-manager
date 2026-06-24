const { body, validationResult } = require('express-validator')

const handleValidationError = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }))
    return res.status(400).send({ success: false, message: 'Validation failed', errors: formattedErrors })
  }
  return next()
}

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
  handleValidationError,
]

const validateLogin = [
  body('email').isEmail().trim().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Required password'),
  handleValidationError,
]

module.exports = { validateRegister, validateLogin }
