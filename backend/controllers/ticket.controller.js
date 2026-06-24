const User = require('../models/User')
const Ticket = require('../models/Ticket')
const { UserNotFound, MissingFields } = require('../utils/HttpError')

const getTickets = async (req, res, next) => {
  try {
    const { jwtUser } = req

    const user = await User.findById(jwtUser.user_id)

    if (!user) {
      throw new UserNotFound()
    }

    const tickets = await Ticket.find(user.isAdmin() ? {} : { createdBy: user._id })

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

module.exports = { getTickets, createTicket }
