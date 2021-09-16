import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asValue } from '../../src/index.js'

describe('asValue', function () {
  const as123 = asValue(123)
  const asFoo = asValue('foo')
  const asNull = asValue(null)
  const asUndefined = asValue(undefined)
  const asTrue = asValue(true)

  it('excepts only literal', function () {
    // Numbers
    expect(as123(123)).equals(123)
    expect(() => as123('123')).throws(TypeError, `Expected 123`)

    // String
    expect(asFoo('foo')).equals('foo')
    expect(() => asFoo('bar')).throws(TypeError, `Expected "foo"`)

    // Null
    expect(asNull(null)).equals(null)
    expect(() => asNull(undefined)).throws(TypeError, `Expected null`)

    // Undefined
    expect(asUndefined(undefined)).equals(undefined)
    expect(() => asUndefined(null)).throws(TypeError, `Expected undefined`)

    // Object
    expect(asTrue(true)).equals(true)
    expect(() => asTrue(false)).throws(TypeError, `Expected true`)
  })
})
