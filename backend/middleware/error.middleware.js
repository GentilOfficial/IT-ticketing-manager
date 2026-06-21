const { HttpError, InternalServerError } = require('../utils/HttpError')

const errorHandler = async (error, req, res, next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).send({ success: false, message: error.message })
  }

  const internalError = new InternalServerError()
  return res.status(internalError.status).send({ success: false, message: internalError.message })
}

module.exports = { errorHandler }
