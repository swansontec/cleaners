import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asArray, asString } from '../../src/index.js'

describe('asArray', function () {
  const asStringArray = asArray(asString)

  it('accepts arrays', function () {
    expect(asStringArray([])).deep.equals([])
    expect(asStringArray(['hey'])).deep.equals(['hey'])
  })

  it('rejects non-arrays', function () {
    expect(() => asStringArray({ length: 0 })).throws(
      TypeError,
      'Expected an array'
    )
  })

  it('rejects invalid contents', function () {
    expect(() => asStringArray([1])).throws(
      TypeError,
      'Expected a string, got 1 at [0]'
    )
  })
})
