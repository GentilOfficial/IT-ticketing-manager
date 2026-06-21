const { HttpError, InternalServerError } = require('../utils/HttpError')

const errorHandler = async (error, req, res, next) => {
  if (error instanceof HttpError) {
    res.status(error.status).send({ error: error.message })
  }

  const internalError = new InternalServerError()
  res.status(internalError.status).send({ error: internalError.message })
}

module.exports = { errorHandler }
