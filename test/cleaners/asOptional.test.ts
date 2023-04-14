import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asArray, asNumber, asOptional } from '../../src/index.js'

describe('asOptional', function () {
  const asMaybeNumber = asOptional(asNumber)

  it('accepts optional values', function () {
    expect(asMaybeNumber(1)).equals(1)
    expect(asMaybeNumber(null)).equals(undefined)
    expect(asMaybeNumber(undefined)).equals(undefined)
  })

  it('rejects invalid contents', function () {
    expect(() => asMaybeNumber('boom')).throws(TypeError, 'Expected a number')
  })

  it('returns fallback values', function () {
    const asSafeNumber = asOptional(asNumber, 0)
    const asSafeNumbers = asOptional(asArray(asNumber), () => [])

    // Simple fallback:
    expect(asSafeNumber(undefined)).equals(0)

    // Function-style fallback:
    const fallback = asSafeNumbers(undefined)
    expect(fallback).deep.equals([])
    expect(asSafeNumbers(undefined)).not.equals(fallback)
  })
})
