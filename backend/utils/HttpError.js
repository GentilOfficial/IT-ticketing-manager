class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

class InternalServerError extends HttpError {
  constructor() {
    super(500, 'Internal server error. Try again later.')
  }
}

module.exports = { HttpError, InternalServerError }
