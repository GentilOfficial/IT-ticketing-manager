const express = require('express')
const ticketRoutes = express.Router()
const ticketController = require('../controllers/ticket.controller')
const { validateTicketCreate, validateTicketUpdate } = require('../middleware/validation/rules/ticket.validation')

ticketRoutes.get('/', ticketController.getTickets)
ticketRoutes.post('/', validateTicketCreate, ticketController.createTicket)
ticketRoutes.get('/:id', ticketController.getTicketDetails)
ticketRoutes.put('/:id', validateTicketUpdate, ticketController.editTicketDetails)

module.exports = { ticketRoutes }
