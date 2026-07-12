const Ticket = require('../models/Ticket')
const User = require('../models/User')
const { UnauthorizedUser, TicketNotFound, UserNotFound } = require('../utils/HttpError')

const adminOnly = async (req, res, next) => {
  try {
    const { user } = req

    if (!user.isAdmin()) {
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

    if (!user.isAdmin() && !ticket.createdBy.equals(user.id)) {
      throw new UnauthorizedUser()
    }

    req.ticket = ticket

    return next()
  } catch (e) {
    return next(e)
  }
}

const requireUserAccess = async (req, res, next) => {
  try {
    const { user, params } = req

    const accessedUser = await User.findById(params.id)

    if (!accessedUser) {
      throw new UserNotFound()
    }

    if (!user.isAdmin()) {
      throw new UnauthorizedUser()
    }

    req.accessedUser = accessedUser

    return next()
  } catch (e) {
    return next(e)
  }
}

module.exports = { adminOnly, requireTicketAccess, requireUserAccess }
