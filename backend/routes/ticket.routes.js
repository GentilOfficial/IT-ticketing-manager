const express = require('express')
const ticketRoutes = express.Router()
const ticketController = require('../controllers/ticket.controller')

ticketRoutes.get('/', ticketController.getTickets)
ticketRoutes.post('/', ticketController.createTicket)
ticketRoutes.get('/:id', ticketController.getTicketDetails)

module.exports = { ticketRoutes }
