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

class MissingFields extends HttpError {
  constructor() {
    super(400, 'Missing required fields. Check and try again.')
  }
}

class InvalidCredentials extends HttpError {
  constructor() {
    super(400, 'Invalid credentials. Try again.')
  }
}

class MissingToken extends HttpError {
  constructor() {
    super(401, 'Missing authorization token.')
  }
}

class InvalidToken extends HttpError {
  constructor() {
    super(401, 'Authorization token not valid.')
  }
}

class UserNotFound extends HttpError {
  constructor() {
    super(404, 'User not found.')
  }
}

class UnauthorizedUser extends HttpError {
  constructor() {
    super(403, 'Access denied. Insufficient permissions.')
  }
}

class TicketStatusUnauthorizedUser extends HttpError {
  constructor() {
    super(403, 'You are not authorized to change the ticket status.')
  }
}

class TicketNotFound extends HttpError {
  constructor() {
    super(404, 'Ticket not found.')
  }
}

class ValidationError extends HttpError {
  constructor(errors) {
    super(400, 'Validation failed.')
    this.errors = errors
  }
}

class InvalidObjectId extends HttpError {
  constructor() {
    super(400, `Invalid resource id.`)
  }
}

module.exports = {
  HttpError,
  InternalServerError,
  InvalidTicketStatusTransition,
  MissingFields,
  InvalidCredentials,
  MissingToken,
  InvalidToken,
  UserNotFound,
  UnauthorizedUser,
  TicketStatusUnauthorizedUser,
  TicketNotFound,
  ValidationError,
  InvalidObjectId,
}
