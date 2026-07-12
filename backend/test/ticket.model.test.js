const test = require('node:test')
const assert = require('node:assert/strict')
const { Types } = require('mongoose')

const Ticket = require('../models/Ticket')
const { AssignedUserNotAdmin, InvalidTicketStatusTransition } = require('../utils/HttpError')

const createTicket = ({ status = 'open', assignedTo = new Types.ObjectId() } = {}) =>
  new Ticket({
    title: 'Printer is not working',
    description: 'The office printer is showing an error code and cannot print documents.',
    createdBy: new Types.ObjectId(),
    status,
    assignedTo,
  })

test('Ticket.changeStatus allows every declared valid transition', () => {
  const allowedTransitions = {
    open: ['in_progress', 'on_hold'],
    in_progress: ['resolved', 'on_hold', 'open'],
    on_hold: ['in_progress', 'open'],
    resolved: ['open'],
  }

  for (const [from, targets] of Object.entries(allowedTransitions)) {
    for (const to of targets) {
      const ticket = createTicket({ status: from })
      const result = ticket.changeStatus(to)

      assert.equal(result, ticket)
      assert.equal(ticket.status, to)
    }
  }
})

test('Ticket.changeStatus throws InvalidTicketStatusTransition on invalid transition', () => {
  const ticket = createTicket({ status: 'open' })

  assert.throws(() => ticket.changeStatus('resolved'), InvalidTicketStatusTransition)
})

test('Ticket.changeStatus throws when ticket is not assigned', () => {
  const ticket = createTicket({ status: 'open', assignedTo: null })

  assert.throws(
    () => ticket.changeStatus('in_progress'),
    (error) =>
      error instanceof InvalidTicketStatusTransition &&
      error.message.includes('Ticket must be assigned to change status'),
  )
})

test('Ticket.assignTo throws when target user is not admin', () => {
  const ticket = createTicket()
  const targetUser = {
    id: new Types.ObjectId(),
    isAdmin: () => false,
  }

  assert.throws(() => ticket.assignTo(targetUser), AssignedUserNotAdmin)
})

test('Ticket.assignTo assigns user id when target user is admin', () => {
  const ticket = createTicket()
  const targetUser = {
    id: new Types.ObjectId(),
    isAdmin: () => true,
  }

  const result = ticket.assignTo(targetUser)

  assert.equal(result, ticket)
  assert.equal(ticket.assignedTo.toString(), targetUser.id.toString())
})
