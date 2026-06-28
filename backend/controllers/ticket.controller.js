const User = require('../models/User')
const Ticket = require('../models/Ticket')
const {
  UserNotFound,
  MissingFields,
  TicketNotFound,
  UnauthorizedUser,
  UnauthorizedTicketEdit,
  AuthenticatedUserNotFound,
} = require('../utils/HttpError')
const { sendSuccess } = require('../utils/responses')

const getTickets = async (req, res, next) => {
  try {
    const { jwtUser } = req

    const user = await User.findById(jwtUser.user_id)

    if (!user) {
      throw new AuthenticatedUserNotFound()
    }

    const tickets = await Ticket.find(user.isAdmin() ? {} : { createdBy: user.id })

    return sendSuccess(res, { tickets })
  } catch (e) {
    return next(e)
  }
}

const createTicket = async (req, res, next) => {
  try {
    const { jwtUser } = req

    const { title, description } = req.body

    if (!title || !description) {
      throw new MissingFields()
    }

    const user = await User.findById(jwtUser.user_id)

    if (!user) {
      throw new AuthenticatedUserNotFound()
    }

    const ticket = new Ticket({ title, description, createdBy: user.id })
    await ticket.save()

    return sendSuccess(res, { ticket }, 201)
  } catch (e) {
    return next(e)
  }
}

const getTicketDetails = async (req, res, next) => {
  try {
    const { params, jwtUser } = req

    const ticket = await Ticket.findById(params.id)

    if (!ticket) {
      throw new TicketNotFound()
    }

    const user = await User.findById(jwtUser.user_id)

    if (!user) {
      throw new AuthenticatedUserNotFound()
    }

    if (!user.isAdmin() && ticket.createdBy.id !== user.id) {
      throw new UnauthorizedUser()
    }

    return sendSuccess(res, { ticket })
  } catch (e) {
    return next(e)
  }
}

const editTicketDetails = async (req, res, next) => {
  try {
    const { params, jwtUser } = req

    const ticket = await Ticket.findById(params.id)

    if (!ticket) {
      throw new TicketNotFound()
    }

    const user = await User.findById(jwtUser.user_id)

    if (!user) {
      throw new AuthenticatedUserNotFound()
    }

    if (!user.isAdmin() && !ticket.createdBy.equals(user.id)) {
      throw new UnauthorizedUser()
    }

    const { title, description, status, assignedTo } = req.body

    if (title) ticket.title = title
    if (description) ticket.description = description

    if (status) {
      if (!user.isAdmin()) throw new UnauthorizedTicketEdit('status')
      ticket.changeStatus(status)
    }

    if (assignedTo) {
      if (!user.isAdmin()) throw new UnauthorizedTicketEdit('assignedTo')
      const assignedUser = await User.findById(assignedTo)

      if (!assignedUser) {
        throw new UserNotFound()
      }

      ticket.assignTo(assignedUser)
    }

    await ticket.save()

    return sendSuccess(res, { ticket })
  } catch (e) {
    return next(e)
  }
}

module.exports = { getTickets, createTicket, getTicketDetails, editTicketDetails }
