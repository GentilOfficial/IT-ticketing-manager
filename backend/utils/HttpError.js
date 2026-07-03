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
  constructor(currentStatus, newStatus, reason) {
    const message = `Status transition not allowed: ${currentStatus} to ${newStatus}`
    super(422, reason ? `${message}. ${reason}` : message)
  }
}

class MissingFields extends HttpError {
  constructor() {
    super(400, 'Missing required fields. Check and try again.')
  }
}

class InvalidCredentials extends HttpError {
  constructor() {
    super(401, 'Invalid credentials. Try again.')
  }
}

class MissingToken extends HttpError {
  constructor() {
    super(401, 'Missing authorization token.')
  }
}

class InvalidToken extends HttpError {
  constructor() {
    super(419, 'Authorization token not valid.')
  }
}

class AuthenticatedUserNotFound extends HttpError {
  constructor() {
    super(401, 'Authenticated user not found.')
  }
}

class SessionExpired extends HttpError {
  constructor() {
    super(419, 'Session expired. Please login again.')
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

class UnauthorizedTicketEdit extends HttpError {
  constructor(field = null) {
    super(403, `You are not authorized to edit the ${field} field.`)
  }
}

class TicketNotFound extends HttpError {
  constructor() {
    super(404, 'Ticket not found.')
  }
}

class ValidationError extends HttpError {
  constructor(errors) {
    super(422, 'Validation failed.')
    this.errors = errors
  }
}

class InvalidObjectId extends HttpError {
  constructor() {
    super(400, 'Invalid resource id.')
  }
}

class AssignedUserNotAdmin extends HttpError {
  constructor() {
    super(422, 'The specified user is not an administrator.')
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
  AuthenticatedUserNotFound,
  SessionExpired,
  UserNotFound,
  UnauthorizedUser,
  UnauthorizedTicketEdit,
  TicketNotFound,
  ValidationError,
  InvalidObjectId,
  AssignedUserNotAdmin,
}
