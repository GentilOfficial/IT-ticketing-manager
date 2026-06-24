const { validationResult } = require('express-validator')

const validateRequest = (req, res, next) => {
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

module.exports = { validateRequest }
