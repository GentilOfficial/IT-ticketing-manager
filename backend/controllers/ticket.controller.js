const User = require('../models/User')
const Ticket = require('../models/Ticket')
const { UserNotFound, MissingFields, UnauthorizedTicketEdit } = require('../utils/HttpError')
const { sendSuccess } = require('../utils/responses')

const getTickets = async (req, res, next) => {
  try {
    const { user, query } = req

    const { search, status } = query

    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10))
    const skip = (page - 1) * limit

    const filters = {
      ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
      ...(status ? { status } : {}),
      ...(user.isAdmin() ? {} : { createdBy: user.id }),
    }

    const [tickets, total] = await Promise.all([
      Ticket.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Ticket.countDocuments(filters),
    ])

    return sendSuccess(res, {
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
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
