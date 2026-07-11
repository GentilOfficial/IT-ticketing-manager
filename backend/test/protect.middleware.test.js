const test = require('node:test')
const assert = require('node:assert/strict')
const { sign } = require('jsonwebtoken')

const { protectRoutes } = require('../middleware/protect.middleware')
const { InvalidToken, MissingToken } = require('../utils/HttpError')
const User = require('../models/User')

const createReq = ({ token, sessionUserId } = {}) => ({
  path: '/api/tickets',
  method: 'GET',
  headers: token ? { authorization: token } : {},
  session: sessionUserId ? { user_id: sessionUserId } : {},
})

const createNextSpy = () => {
  const calls = []
  const next = (error) => calls.push(error)
  return { next, calls }
}

test('protectRoutes with valid JWT and matching session calls next with req.user populated', async (t) => {
  process.env.JWT_SIGN_SECRET = 'test-secret'

  const userId = 'user-123'
  const token = sign({ user_id: userId }, process.env.JWT_SIGN_SECRET)
  const req = createReq({ token, sessionUserId: userId })
  const mockUser = { id: userId, role: 'admin' }

  const originalFindById = User.findById
  User.findById = async (id) => {
    assert.equal(id, userId)
    return mockUser
  }
  t.after(() => {
    User.findById = originalFindById
  })

  const { next, calls } = createNextSpy()

  await protectRoutes(req, {}, next)

  assert.equal(calls.length, 1)
  assert.equal(calls[0], undefined)
  assert.equal(req.user, mockUser)
})

test('protectRoutes with missing or malformed JWT calls next with auth error', async () => {
  process.env.JWT_SIGN_SECRET = 'test-secret'

  const missingTokenReq = createReq({ sessionUserId: 'user-123' })
  const missingTokenNext = createNextSpy()

  await protectRoutes(missingTokenReq, {}, missingTokenNext.next)

  assert.equal(missingTokenNext.calls.length, 1)
  assert.ok(missingTokenNext.calls[0] instanceof MissingToken)

  const malformedTokenReq = createReq({ token: 'not-a-jwt', sessionUserId: 'user-123' })
  const malformedTokenNext = createNextSpy()

  await protectRoutes(malformedTokenReq, {}, malformedTokenNext.next)

  assert.equal(malformedTokenNext.calls.length, 1)
  assert.ok(malformedTokenNext.calls[0] instanceof InvalidToken)
})

test('protectRoutes with valid JWT but missing or mismatched session calls next with InvalidToken', async () => {
  process.env.JWT_SIGN_SECRET = 'test-secret'

  const userId = 'user-123'
  const token = sign({ user_id: userId }, process.env.JWT_SIGN_SECRET)

  const missingSessionReq = createReq({ token })
  const missingSessionNext = createNextSpy()

  await protectRoutes(missingSessionReq, {}, missingSessionNext.next)

  assert.equal(missingSessionNext.calls.length, 1)
  assert.ok(missingSessionNext.calls[0] instanceof InvalidToken)

  const mismatchedSessionReq = createReq({ token, sessionUserId: 'user-999' })
  const mismatchedSessionNext = createNextSpy()

  await protectRoutes(mismatchedSessionReq, {}, mismatchedSessionNext.next)

  assert.equal(mismatchedSessionNext.calls.length, 1)
  assert.ok(mismatchedSessionNext.calls[0] instanceof InvalidToken)
})
