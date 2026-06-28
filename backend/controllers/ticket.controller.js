const User = require('../models/User')
const Ticket = require('../models/Ticket')
const { UserNotFound, MissingFields, UnauthorizedTicketEdit } = require('../utils/HttpError')
const { sendSuccess } = require('../utils/responses')

const getTickets = async (req, res, next) => {
  try {
    const { user } = req

    const tickets = await Ticket.find(user.isAdmin() ? {} : { createdBy: user.id })

    return sendSuccess(res, { tickets })
  } catch (e) {
    return next(e)
  }
}

const createTicket = async (req, res, next) => {
  try {
    const { user, body } = req
    const { title, description } = body

    if (!title || !description) {
      throw new MissingFields()
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
    const { ticket } = req

    return sendSuccess(res, { ticket })
  } catch (e) {
    return next(e)
  }
}

const editTicketDetails = async (req, res, next) => {
  try {
    const { user, ticket, body } = req
    const { title, description, status, assignedTo } = body

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
