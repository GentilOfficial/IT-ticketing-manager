const Comment = require('../models/Comment')
const { MissingFields } = require('../utils/HttpError')
const { sendSuccess } = require('../utils/responses')

const getTicketComments = async (req, res, next) => {
  try {
    const { ticket } = req

    const comments = await Comment.find({ ticket: ticket.id })

    return sendSuccess(res, { comments })
  } catch (e) {
    return next(e)
  }
}

const createTicketComment = async (req, res, next) => {
  try {
    const { user, ticket } = req
    const { message } = req.body

    if (!message) {
      throw new MissingFields()
    }

    const comment = new Comment({ message, author: user.id, ticket: ticket.id })
    await comment.save()

    return sendSuccess(res, { comment }, 201)
  } catch (e) {
    return next(e)
  }
}

module.exports = { getTicketComments, createTicketComment }
