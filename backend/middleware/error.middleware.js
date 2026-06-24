const { Error } = require('mongoose')
const { HttpError, InternalServerError, InvalidObjectId } = require('../utils/HttpError')
const { sendError } = require('../utils/responses')

const mapError = (err) => {
  if (err instanceof HttpError) {
    return err
  }

  if (err instanceof Error.CastError) {
    return new InvalidObjectId()
  }

  return new InternalServerError()
}

const errorHandler = async (err, req, res, next) => {
  const error = mapError(err)
  return sendError(res, error.status, error.message, error.errors)
}

module.exports = { errorHandler }
