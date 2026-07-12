const test = require('node:test')
const assert = require('node:assert/strict')

const Ticket = require('../models/Ticket')
const User = require('../models/User')
const { adminOnly, requireTicketAccess, requireUserAccess } = require('../middleware/authorized.middleware')
const { TicketNotFound, UnauthorizedUser } = require('../utils/HttpError')

const createNextSpy = () => {
  const calls = []
  return {
    next: (err) => calls.push(err),
    calls,
  }
}

test('requireTicketAccess allows creator to access ticket', async (t) => {
  const userId = 'user-1'
  const ticket = {
    createdBy: {
      equals: (id) => id === userId,
    },
  }

  t.mock.method(Ticket, 'findById', async () => ticket)

  const req = {
    user: {
      id: userId,
      isAdmin: () => false,
    },
    params: { id: 'ticket-1' },
  }
  const { next, calls } = createNextSpy()

  await requireTicketAccess(req, {}, next)

  assert.equal(calls.length, 1)
  assert.equal(calls[0], undefined)
  assert.equal(req.ticket, ticket)
})

test('requireTicketAccess allows admin on any ticket', async (t) => {
  const ticket = {
    createdBy: {
      equals: () => false,
    },
  }

  t.mock.method(Ticket, 'findById', async () => ticket)

  const req = {
    user: {
      id: 'admin-1',
      isAdmin: () => true,
    },
    params: { id: 'ticket-1' },
  }
  const { next, calls } = createNextSpy()

  await requireTicketAccess(req, {}, next)

  assert.equal(calls.length, 1)
  assert.equal(calls[0], undefined)
  assert.equal(req.ticket, ticket)
})

test('requireTicketAccess rejects non-admin non-creator user', async (t) => {
  const ticket = {
    createdBy: {
      equals: () => false,
    },
  }

  t.mock.method(Ticket, 'findById', async () => ticket)

  const req = {
    user: {
      id: 'user-2',
      isAdmin: () => false,
    },
    params: { id: 'ticket-1' },
  }
  const { next, calls } = createNextSpy()

  await requireTicketAccess(req, {}, next)

  assert.equal(calls.length, 1)
  assert.ok(calls[0] instanceof UnauthorizedUser)
})

test('requireTicketAccess handles missing ticket id with TicketNotFound', async (t) => {
  t.mock.method(Ticket, 'findById', async () => null)

  const req = {
    user: {
      id: 'user-1',
      isAdmin: () => true,
    },
    params: { id: 'missing' },
  }
  const { next, calls } = createNextSpy()

  await requireTicketAccess(req, {}, next)

  assert.equal(calls.length, 1)
  assert.ok(calls[0] instanceof TicketNotFound)
})

test('adminOnly allows admin and rejects normal user', async () => {
  const adminReq = { user: { role: 'admin' } }
  const adminNext = createNextSpy()

  await adminOnly(adminReq, {}, adminNext.next)
  assert.equal(adminNext.calls.length, 1)
  assert.equal(adminNext.calls[0], undefined)

  const userReq = { user: { role: 'user' } }
  const userNext = createNextSpy()

  await adminOnly(userReq, {}, userNext.next)
  assert.equal(userNext.calls.length, 1)
  assert.ok(userNext.calls[0] instanceof UnauthorizedUser)
})

test('requireUserAccess follows admin-only pattern', async (t) => {
  const accessedUser = { id: 'target-user' }
  t.mock.method(User, 'findById', async () => accessedUser)

  const adminReq = {
    user: { isAdmin: () => true },
    params: { id: 'target-user' },
  }
  const adminNext = createNextSpy()

  await requireUserAccess(adminReq, {}, adminNext.next)

  assert.equal(adminNext.calls.length, 1)
  assert.equal(adminNext.calls[0], undefined)
  assert.equal(adminReq.accessedUser, accessedUser)

  const userReq = {
    user: { isAdmin: () => false },
    params: { id: 'target-user' },
  }
  const userNext = createNextSpy()

  await requireUserAccess(userReq, {}, userNext.next)

  assert.equal(userNext.calls.length, 1)
  assert.ok(userNext.calls[0] instanceof UnauthorizedUser)
})
