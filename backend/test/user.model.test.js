const test = require('node:test')
const assert = require('node:assert/strict')
const { Types } = require('mongoose')

const User = require('../models/User')
const {
  UnauthorizedFieldEdit,
  EmailAlreadyRegistered,
  InvalidGoogleProfile,
  UnverifiedGoogleEmail,
} = require('../utils/HttpError')

const createUser = ({ id = new Types.ObjectId(), role = 'user' } = {}) =>
  new User({
    _id: id,
    name: 'Mario Rossi',
    email: `${id.toString()}@example.com`,
    password: 'Password1!',
    role,
  })

test('User.changeRole rejects an admin editing their own role', () => {
  const id = new Types.ObjectId()
  const targetUser = createUser({ id, role: 'admin' })
  const editor = createUser({ id, role: 'admin' })

  assert.throws(() => targetUser.changeRole('user', editor), UnauthorizedFieldEdit)
})

test('User.changeRole allows admin editing another user role', () => {
  const targetUser = createUser({ role: 'user' })
  const editor = createUser({ role: 'admin' })

  const result = targetUser.changeRole('admin', editor)

  assert.equal(result, targetUser)
  assert.equal(targetUser.role, 'admin')
})

test('User.findOrCreateFromGoogle returns existing Google user without creating a new one', async (t) => {
  const existingUser = createUser({ role: 'user' })
  let createCalled = false

  t.mock.method(User, 'findOne', async (query) => {
    if (query['oauth.id']) {
      return existingUser
    }

    return null
  })

  t.mock.method(User, 'create', async () => {
    createCalled = true
    return null
  })

  const profile = {
    id: 'google-id-1',
    displayName: 'Mario Rossi',
    emails: [{ value: 'mario@example.com', verified: true }],
  }

  const user = await User.findOrCreateFromGoogle(profile)

  assert.equal(user, existingUser)
  assert.equal(createCalled, false)
})

test('User.findOrCreateFromGoogle creates a Google user for a new email', async (t) => {
  let createdPayload = null

  t.mock.method(User, 'findOne', async () => null)
  t.mock.method(User, 'exists', async () => false)
  t.mock.method(User, 'create', async (payload) => {
    createdPayload = payload
    return payload
  })

  const profile = {
    id: 'google-id-2',
    displayName: 'Giulia Bianchi',
    emails: [{ value: 'giulia@example.com', verified: true }],
  }

  const user = await User.findOrCreateFromGoogle(profile)

  assert.equal(user, createdPayload)
  assert.equal(createdPayload.email, 'giulia@example.com')
  assert.equal(createdPayload.role, 'admin')
  assert.equal(createdPayload.oauth.provider, 'google')
  assert.equal(createdPayload.oauth.id, 'google-id-2')
})

test('User.findOrCreateFromGoogle throws EmailAlreadyRegistered for existing local account email', async (t) => {
  t.mock.method(User, 'findOne', async (query) => {
    if (query['oauth.id']) {
      return null
    }

    return createUser({ role: 'user' })
  })

  const profile = {
    id: 'google-id-3',
    displayName: 'Luca Verdi',
    emails: [{ value: 'local@example.com', verified: true }],
  }

  await assert.rejects(() => User.findOrCreateFromGoogle(profile), EmailAlreadyRegistered)
})

test('User.findOrCreateFromGoogle throws InvalidGoogleProfile when profile is missing or invalid', async () => {
  await assert.rejects(() => User.findOrCreateFromGoogle(null), InvalidGoogleProfile)
  await assert.rejects(() => User.findOrCreateFromGoogle({}), InvalidGoogleProfile)
})

test('User.findOrCreateFromGoogle throws UnverifiedGoogleEmail when google email is missing or not verified', async (t) => {
  t.mock.method(User, 'findOne', async () => null)

  await assert.rejects(() => User.findOrCreateFromGoogle({ id: 'google-id-4', emails: [] }), UnverifiedGoogleEmail)

  await assert.rejects(
    () =>
      User.findOrCreateFromGoogle({
        id: 'google-id-5',
        emails: [{ value: 'not-verified@example.com', verified: false }],
      }),
    UnverifiedGoogleEmail,
  )
})
