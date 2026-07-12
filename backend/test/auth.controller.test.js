const test = require('node:test')
const assert = require('node:assert/strict')

const User = require('../models/User')
const { login } = require('../controllers/auth.controller')
const { OAuthOnlyAccount } = require('../utils/HttpError')

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

test('login rejects password auth for Google OAuth account before password comparison', async (t) => {
  let comparePasswordCalled = false

  t.mock.method(User, 'findOne', () => ({
    select: async () => ({
      id: 'user-1',
      oauth: { provider: 'google' },
      isLocal: () => false,
      comparePassword: async () => {
        comparePasswordCalled = true
        return true
      },
    }),
  }))

  const req = {
    body: {
      email: 'user@example.com',
      password: 'Password1!',
    },
    session: {},
  }
  const res = createRes()
  const { next, calls } = createNextSpy()

  await login(req, res, next)

  assert.equal(calls.length, 1)
  assert.ok(calls[0] instanceof OAuthOnlyAccount)
  assert.equal(comparePasswordCalled, false)
})
