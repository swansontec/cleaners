import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asNumber, asOptional } from '../../src/index.js'

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
})
