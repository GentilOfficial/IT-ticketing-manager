const express = require('express')
const ticketRoutes = express.Router()
const ticketController = require('../controllers/ticket.controller')
const commentController = require('../controllers/comment.controller')
const { requireTicketAccess } = require('../middleware/authorized.middleware')
const { validateTicketCreate, validateTicketUpdate } = require('../middleware/validation/rules/ticket.validation')
const { validateCommentCreate } = require('../middleware/validation/rules/comment.validation')

ticketRoutes.get('/', ticketController.getTickets)
ticketRoutes.get('/stats', ticketController.getTicketStats)
ticketRoutes.post('/', validateTicketCreate, ticketController.createTicket)
ticketRoutes.get('/:id', requireTicketAccess, ticketController.getTicketDetails)
ticketRoutes.put('/:id', [validateTicketUpdate, requireTicketAccess], ticketController.editTicketDetails)

ticketRoutes.get('/:id/comments', requireTicketAccess, commentController.getTicketComments)
ticketRoutes.post('/:id/comments', [validateCommentCreate, requireTicketAccess], commentController.createTicketComment)

module.exports = { ticketRoutes }
