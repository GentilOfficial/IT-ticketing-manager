const test = require('node:test')
const assert = require('node:assert/strict')

const userRoutesPath = require.resolve('../routes/user.routes')
require.cache[userRoutesPath] = {
  id: userRoutesPath,
  filename: userRoutesPath,
  loaded: true,
  exports: { userRoutes: {} },
}

const User = require('../models/User')
const { allUsers, editUser } = require('../controllers/user.controller')
const { errorHandler } = require('../middleware/error.middleware')
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

test('allUsers builds $or filter with both name and email regex conditions', async (t) => {
  let capturedFilter = null

  t.mock.method(User, 'countDocuments', async (filter) => {
    capturedFilter = filter
    return 1
  })
  t.mock.method(User, 'find', (filter) => {
    capturedFilter = filter
    return buildFindChain([{ _id: '1', name: 'Mario', email: 'mario@example.com' }])
  })

  const req = {
    query: {
      search: 'mario@example.com',
      page: '1',
      limit: '20',
    },
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await allUsers(req, res, next)

  assert.equal(calls.length, 0)
  assert.ok(Array.isArray(capturedFilter.$or))
  assert.equal(capturedFilter.$or.length, 2)
  assert.ok(capturedFilter.$or[0].name)
  assert.ok(capturedFilter.$or[1].email)
  assert.equal(capturedFilter.$or[0].name.$options, 'i')
  assert.equal(capturedFilter.$or[1].email.$options, 'i')
  assert.equal(res.body.success, true)
})

test('editUser delegates role updates to accessedUser.changeRole', async () => {
  const calls = []
  const accessedUser = {
    changeRole: (role, editor) => calls.push([role, editor]),
    save: async () => {},
  }
  const editor = { id: 'admin-1', isAdmin: () => true }

  const req = {
    user: editor,
    accessedUser,
    body: {
      role: 'admin',
    },
  }
  const res = createRes()
  const { next, calls: nextCalls } = createNextSpy()

  await editUser(req, res, next)

  assert.equal(nextCalls.length, 0)
  assert.equal(calls.length, 1)
  assert.equal(calls[0][0], 'admin')
  assert.equal(calls[0][1], editor)
  assert.equal(res.body.success, true)
  assert.equal(res.body.user, accessedUser)
})

test('editUser self-role rejection propagates to HTTP response through error middleware', async () => {
  const accessedUser = {
    changeRole: () => {
      throw new UnauthorizedFieldEdit('role')
    },
    save: async () => {},
  }

  const req = {
    user: { id: 'admin-1', isAdmin: () => true },
    accessedUser,
    body: {
      role: 'user',
    },
  }
  const controllerRes = createRes()
  const nextSpy = createNextSpy()

  await editUser(req, controllerRes, nextSpy.next)

  assert.equal(nextSpy.calls.length, 1)
  const err = nextSpy.calls[0]
  assert.ok(err instanceof UnauthorizedFieldEdit)

  const errorRes = createRes()
  await errorHandler(err, req, errorRes, () => {})

  assert.equal(errorRes.statusCode, 403)
  assert.equal(errorRes.body.success, false)
  assert.equal(errorRes.body.message, 'You are not authorized to edit the role field.')
})
