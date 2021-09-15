import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asValue } from '../../src/index.js'

describe('asValue', function () {
  const asTrue = asValue(true)
  const as123 = asValue(123)
  const asFoo = asValue('foo')
  const asNull = asValue(null)
  const asUndefined = asValue(undefined)
  const asEnum = asValue(undefined, true, 'too-hot', 'too-cold', 42)

  it('accepts boolean values', function () {
    expect(asTrue(true)).equals(true)
    expect(() => asTrue(false)).throws(TypeError, `Expected true`)
  })

  it('accepts number values', function () {
    expect(as123(123)).equals(123)
    expect(() => as123('123')).throws(TypeError, `Expected 123`)
  })

  it('accepts string values', function () {
    expect(asFoo('foo')).equals('foo')
    expect(() => asFoo('bar')).throws(TypeError, `Expected "foo"`)
  })

  it('accepts null values', function () {
    expect(asNull(null)).equals(null)
    expect(() => asNull(undefined)).throws(TypeError, `Expected null`)
  })

  it('accepts undefined values', function () {
    expect(asUndefined(undefined)).equals(undefined)
    expect(() => asUndefined(null)).throws(TypeError, `Expected undefined`)
  })

  it('accepts multiple values', function () {
    expect(asEnum(undefined)).equals(undefined)
    expect(asEnum(true)).equals(true)
    expect(asEnum('too-hot')).equals('too-hot')
    expect(asEnum('too-cold')).equals('too-cold')
    expect(asEnum(42)).equals(42)
  })

  it('rejects excluded values', function () {
    const message =
      'Expected one of: undefined | true | "too-hot" | "too-cold" | 42'

    expect(() => asEnum(null)).throws(TypeError, message)
    expect(() => asEnum(false)).throws(TypeError, message)
    expect(() => asEnum('false')).throws(TypeError, message)
    expect(() => asEnum(23)).throws(TypeError, message)
  })
})
