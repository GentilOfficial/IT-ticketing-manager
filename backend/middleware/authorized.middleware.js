const Ticket = require('../models/Ticket')
const { UnauthorizedUser, TicketNotFound } = require('../utils/HttpError')

const authorizedUser = async (req, res, next) => {
  try {
    const { user } = req

    if (user.role !== 'admin') {
      throw new UnauthorizedUser()
    }

    return next()
  } catch (e) {
    return next(e)
  }
}

const requireTicketAccess = async (req, res, next) => {
  try {
    const { user, params } = req

    const ticket = await Ticket.findById(params.id)

    if (!ticket) {
      throw new TicketNotFound()
    }

    req.ticket = ticket

    if (!user.isAdmin() && !ticket.createdBy.equals(user.id)) {
      throw new UnauthorizedUser()
    }

    return next()
  } catch (e) {
    return next(e)
  }
}

module.exports = { authorizedUser, requireTicketAccess }
