const User = require('../models/User')
const Ticket = require('../models/Ticket')
const { UserNotFound, MissingFields, TicketNotFound, UnauthorizedUser } = require('../utils/HttpError')

const getTickets = async (req, res, next) => {
  try {
    const { jwtUser } = req

    const user = await User.findById(jwtUser.user_id)

    if (!user) {
      throw new UserNotFound()
    }

    const tickets = await Ticket.find(user.isAdmin() ? {} : { createdBy: user.id })

    return res.status(200).send({
      success: true,
      tickets,
    })
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

    const ticket = new Ticket({ title, description, createdBy: jwtUser.user_id })
    await ticket.save()

    return res.status(201).send({
      success: true,
      ticket,
    })
  } catch (e) {
    return next(e)
  }
}

const getTicketDetails = async (req, res, next) => {
  try {
    const { params, jwtUser } = req

    const ticket = await Ticket.findById(params.id).populate(['createdBy'])

    if (!ticket) {
      throw new TicketNotFound()
    }

    const user = await User.findById(jwtUser.user_id)

    if (!user) {
      throw new UserNotFound()
    }

    if (!user.isAdmin() && ticket.createdBy.id !== user.id) {
      throw new UnauthorizedUser()
    }

    return res.status(200).send({
      success: true,
      ticket,
    })
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
      throw new UserNotFound()
    }

    if (!user.isAdmin() && !ticket.createdBy.equals(user.id)) {
      throw new UnauthorizedUser()
    }

    const { title, description, status } = req.body

    if (title) ticket.title = title
    if (description) ticket.description = description

    if (status) {
      await ticket.changeStatus(status)
    } else {
      await ticket.save()
    }

    return res.status(200).send({
      success: true,
      ticket,
    })
  } catch (e) {
    return next(e)
  }
}

module.exports = { getTickets, createTicket, getTicketDetails, editTicketDetails }
