const { validationResult } = require('express-validator')
const { ValidationError } = require('../../utils/HttpError')

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new ValidationError(
        errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      ),
    )
  }
  return next()
}

module.exports = { validateRequest }
