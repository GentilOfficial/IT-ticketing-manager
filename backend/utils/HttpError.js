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

class InvalidTicketStatusTransition extends HttpError {
  constructor(currentStatus, newStatus) {
    super(400, `Status transition not allowed: ${currentStatus} -> ${newStatus}`)
  }
}

module.exports = { HttpError, InternalServerError, InvalidTicketStatusTransition }
