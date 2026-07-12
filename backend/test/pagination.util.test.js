const test = require('node:test')
const assert = require('node:assert/strict')

const { normalizeRegex, getPositiveInteger } = require('../utils/pagination')

test('normalizeRegex escapes all regex special characters literally', () => {
  const input = '.*+?^${}()|[]\\'
  const escaped = normalizeRegex(input)

  assert.equal(
    escaped,
    '\\.' + '\\*' + '\\+' + '\\?' + '\\^' + '\\$' + '\\{' + '\\}' + '\\(' + '\\)' + '\\|' + '\\[' + '\\]' + '\\\\',
  )

  const regex = new RegExp(escaped)
  assert.ok(regex.test(input))
})

test('getPositiveInteger falls back for negative, zero, non-numeric and undefined', () => {
  assert.equal(getPositiveInteger('-5', 10), 10)
  assert.equal(getPositiveInteger('0', 10), 10)
  assert.equal(getPositiveInteger('abc', 10), 10)
  assert.equal(getPositiveInteger(undefined, 10), 10)
})

test('getPositiveInteger currently accepts decimal strings via parseInt truncation', () => {
  assert.equal(getPositiveInteger('3.14', 10), 3)
})
