const test = require('node:test')
const assert = require('node:assert/strict')
const { Types } = require('mongoose')

const User = require('../models/User')
const { UnauthorizedFieldEdit } = require('../utils/HttpError')

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
