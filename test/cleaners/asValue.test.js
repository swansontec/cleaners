import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asValue } from '../../src/index.js'

describe('asValue', function () {
  const asValueNumber = asValue(123)
  const asValueString = asValue('foo')
  const asValueNull = asValue(null)
  const asValueUndefined = asValue(undefined)
  const asValueBoolean = asValue(true)

  it('excepts only literal', function () {
    // Numbers
    expect(asValueNumber(123)).equals(123)
    expect(() => asValueNumber('123')).throws(TypeError, `Expected 123`)

    // String
    expect(asValueString('foo')).equals('foo')
    expect(() => asValueString('bar')).throws(TypeError, `Expected "foo"`)

    // Null
    expect(asValueNull(null)).equals(null)
    expect(() => asValueNull(undefined)).throws(TypeError, `Expected null`)

    // Undefined
    expect(asValueUndefined(undefined)).equals(undefined)
    expect(() => asValueUndefined(null)).throws(TypeError, `Expected undefined`)

    // Object
    expect(asValueBoolean(true)).equals(true)
    expect(() => asValueBoolean(false)).throws(TypeError, `Expected true`)
  })
})
