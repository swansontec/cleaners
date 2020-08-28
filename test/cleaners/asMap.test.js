import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asMap, asNumber } from '../../src/index.js'

describe('asMap', function () {
  const asNumberMap = asMap(asNumber)

  it('accepts objects', function () {
    expect(asNumberMap({ a: 1, b: 2 })).deep.equals({ a: 1, b: 2 })
  })

  it('filters out `__proto__`', function () {
    const danger = JSON.parse('{ "a": 1, "b": 2, "__proto__": 3 }')
    expect(asNumberMap(danger)).deep.equals({ a: 1, b: 2 })
  })

  it('rejects non-objects', function () {
    expect(() => asNumberMap(null)).throws(TypeError, 'Expected an object')
  })

  it('rejects invalid contents', function () {
    expect(() => asNumberMap({ a: false })).throws(
      TypeError,
      'Expected a number at ["a"]'
    )
  })
})
