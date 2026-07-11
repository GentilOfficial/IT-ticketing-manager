const test = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')

const { errorHandler } = require('../middleware/error.middleware')
const { HttpError } = require('../utils/HttpError')

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

test('errorHandler keeps HttpError instances unchanged', async () => {
  const res = createRes()
  const err = new HttpError(418, 'Teapot test')

  await errorHandler(err, {}, res, () => {})

  assert.equal(res.statusCode, 418)
  assert.equal(res.body.success, false)
  assert.equal(res.body.message, 'Teapot test')
})

test('errorHandler maps mongoose CastError to InvalidObjectId response', async () => {
  const res = createRes()
  const err = new mongoose.Error.CastError('ObjectId', 'invalid', 'id')

  await errorHandler(err, {}, res, () => {})

  assert.equal(res.statusCode, 400)
  assert.equal(res.body.success, false)
  assert.equal(res.body.message, 'Invalid resource id.')
})

test('errorHandler maps unknown errors to InternalServerError without leaking original details', async () => {
  const res = createRes()
  const err = new Error('database password leaked')

  await errorHandler(err, {}, res, () => {})

  assert.equal(res.statusCode, 500)
  assert.equal(res.body.success, false)
  assert.equal(res.body.message, 'Internal server error. Try again later.')
  assert.equal('errors' in res.body, false)
  assert.equal('stack' in res.body, false)
  assert.equal(res.body.message.includes('database password leaked'), false)
})
