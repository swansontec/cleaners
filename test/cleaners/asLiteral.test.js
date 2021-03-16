import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asLiteral } from '../../src/index.js'

describe('asLiteral', function () {
  const asLiteralNumber = asLiteral(123)
  const asLiteralString = asLiteral('foo')
  const asLiteralNull = asLiteral(null)
  const asLiteralUndefined = asLiteral(undefined)
  const obj = { prop: 'foo' }
  const asLiteralObject = asLiteral(obj)

  it('excepts only literal', function () {
    // Numbers
    expect(asLiteralNumber(123)).equals(123)
    expect(() => asLiteralNumber('123')).throws(
      TypeError,
      `Expected number literal '123'`
    )

    // String
    expect(asLiteralString('foo')).equals('foo')
    expect(() => asLiteralString('bar')).throws(
      TypeError,
      `Expected string literal '"foo"'`
    )

    // Null
    expect(asLiteralNull(null)).equals(null)
    expect(() => asLiteralNull(undefined)).throws(
      TypeError,
      `Expected object literal 'null'`
    )

    // Undefined
    expect(asLiteralUndefined(undefined)).equals(undefined)
    expect(() => asLiteralUndefined(null)).throws(
      TypeError,
      `Expected undefined literal 'undefined'`
    )

    // Object
    expect(asLiteralObject(obj)).equals(obj)
    expect(() => asLiteralObject({ ...obj })).throws(
      TypeError,
      `Expected object literal '${JSON.stringify(obj)}'`
    )
  })
})
