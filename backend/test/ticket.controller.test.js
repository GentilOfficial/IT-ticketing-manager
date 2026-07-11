const test = require('node:test')
const assert = require('node:assert/strict')
const { Types } = require('mongoose')

const Ticket = require('../models/Ticket')
const User = require('../models/User')
const { createTicket, editTicketDetails, getTicketStats, getTickets } = require('../controllers/ticket.controller')
const { UnauthorizedFieldEdit } = require('../utils/HttpError')

const createRes = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code
    return this
  },
  json(payload) {
    this.body = payload
    return this
  },
})

const createNextSpy = () => {
  const calls = []
  return {
    next: (err) => calls.push(err),
    calls,
  }
}

const buildFindChain = (result) => ({
  sort() {
    return this
  },
  skip() {
    return this
  },
  limit() {
    return Promise.resolve(result)
  },
})

test('getTickets uses global scope for admin users', async (t) => {
  let countFilter = null
  let findFilter = null

  t.mock.method(Ticket, 'countDocuments', async (filters) => {
    countFilter = filters
    return 0
  })
  t.mock.method(Ticket, 'find', (filters) => {
    findFilter = filters
    return buildFindChain([])
  })

  const req = {
    user: {
      isAdmin: () => true,
      id: 'admin-id',
    },
    query: {},
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await getTickets(req, res, next)

  assert.equal(calls.length, 0)
  assert.deepEqual(countFilter, {})
  assert.deepEqual(findFilter, {})
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.success, true)
})

test('getTickets scopes normal users to their created tickets', async (t) => {
  let countFilter = null
  let findFilter = null

  t.mock.method(Ticket, 'countDocuments', async (filters) => {
    countFilter = filters
    return 0
  })
  t.mock.method(Ticket, 'find', (filters) => {
    findFilter = filters
    return buildFindChain([])
  })

  const req = {
    user: {
      isAdmin: () => false,
      id: 'user-id',
    },
    query: {},
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await getTickets(req, res, next)

  assert.equal(calls.length, 0)
  assert.equal(countFilter.createdBy, 'user-id')
  assert.equal(findFilter.createdBy, 'user-id')
})

test('createTicket allows admin to create ticket for provided createdBy', async (t) => {
  const admin = {
    id: new Types.ObjectId(),
    isAdmin: () => true,
  }
  const targetUser = {
    id: new Types.ObjectId(),
  }

  t.mock.method(User, 'findById', async (id) => {
    assert.equal(id, targetUser.id.toString())
    return targetUser
  })
  t.mock.method(Ticket.prototype, 'save', async function () {
    return this
  })

  const req = {
    user: admin,
    body: {
      title: 'Need software update',
      description: 'Please update the CRM client to the latest version.',
      createdBy: targetUser.id.toString(),
    },
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await createTicket(req, res, next)

  assert.equal(calls.length, 0)
  assert.equal(res.statusCode, 201)
  assert.equal(res.body.success, true)
  assert.equal(res.body.ticket.createdBy.toString(), targetUser.id.toString())
})

test('createTicket rejects normal user trying to set createdBy explicitly', async () => {
  const req = {
    user: {
      id: new Types.ObjectId(),
      isAdmin: () => false,
    },
    body: {
      title: 'Need software update',
      description: 'Please update the CRM client to the latest version.',
      createdBy: new Types.ObjectId().toString(),
    },
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await createTicket(req, res, next)

  assert.equal(calls.length, 1)
  assert.ok(calls[0] instanceof UnauthorizedFieldEdit)
  assert.equal(res.body, null)
})

test('editTicketDetails rejects normal user editing status', async () => {
  const req = {
    user: {
      isAdmin: () => false,
    },
    ticket: {
      save: async () => {},
      changeStatus: () => {},
    },
    body: {
      status: 'in_progress',
    },
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await editTicketDetails(req, res, next)

  assert.equal(calls.length, 1)
  assert.ok(calls[0] instanceof UnauthorizedFieldEdit)
})

test('editTicketDetails rejects normal user editing assignedTo', async () => {
  const req = {
    user: {
      isAdmin: () => false,
    },
    ticket: {
      save: async () => {},
      assignTo: () => {},
    },
    body: {
      assignedTo: new Types.ObjectId().toString(),
    },
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await editTicketDetails(req, res, next)

  assert.equal(calls.length, 1)
  assert.ok(calls[0] instanceof UnauthorizedFieldEdit)
})

test('editTicketDetails allows admin to change status and assignedTo', async (t) => {
  const assignedUser = { id: new Types.ObjectId(), isAdmin: () => true }
  const events = []

  t.mock.method(User, 'findById', async (id) => {
    assert.equal(id, assignedUser.id.toString())
    return assignedUser
  })

  const ticket = {
    changeStatus: (status) => events.push(['status', status]),
    assignTo: (user) => events.push(['assignedTo', user]),
    save: async () => events.push(['save']),
  }

  const req = {
    user: {
      isAdmin: () => true,
    },
    ticket,
    body: {
      status: 'in_progress',
      assignedTo: assignedUser.id.toString(),
    },
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await editTicketDetails(req, res, next)

  assert.equal(calls.length, 0)
  assert.deepEqual(events[0], ['status', 'in_progress'])
  assert.equal(events[1][0], 'assignedTo')
  assert.equal(events[1][1], assignedUser)
  assert.deepEqual(events[2], ['save'])
  assert.equal(res.body.success, true)
})

test('getTicketStats uses global scope for admin and user scope for non-admin', async (t) => {
  const aggregateFilters = []
  const countFilters = []

  t.mock.method(Ticket, 'aggregate', async (pipeline) => {
    aggregateFilters.push(pipeline[0].$match)
    return []
  })
  t.mock.method(Ticket, 'countDocuments', async (filters) => {
    countFilters.push(filters)
    return 0
  })

  const adminReq = {
    user: {
      isAdmin: () => true,
      _id: new Types.ObjectId(),
    },
  }
  const userReq = {
    user: {
      isAdmin: () => false,
      _id: new Types.ObjectId(),
    },
  }

  const adminRes = createRes()
  const userRes = createRes()
  const adminNext = createNextSpy()
  const userNext = createNextSpy()

  await getTicketStats(adminReq, adminRes, adminNext.next)
  await getTicketStats(userReq, userRes, userNext.next)

  assert.equal(adminNext.calls.length, 0)
  assert.equal(userNext.calls.length, 0)
  assert.deepEqual(aggregateFilters[0], {})
  assert.deepEqual(countFilters[0], {})
  assert.deepEqual(aggregateFilters[1], { createdBy: userReq.user._id })
  assert.deepEqual(countFilters[1], { createdBy: userReq.user._id })
})
