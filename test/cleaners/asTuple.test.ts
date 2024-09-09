import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asNumber, asString, asTuple } from '../../src/index.js'

describe('asTuple', function () {
  const asNumberwang = asTuple(asNumber, asString)

  it('accepts tuples', function () {
    const data = [1, "that's numberwang", false]
    expect(asNumberwang(data)).deep.equals(data.slice(0, 2))
  })

  it('rejects non-array tuples', function () {
    const data = { length: 0 }
    expect(() => asNumberwang(data)).throws(
      TypeError,
      'Expected an array, got object'
    )
  })

  it('rejects invalid tuple contents', function () {
    expect(() => asNumberwang(['wanganum', 2])).throws(
      TypeError,
      'Expected a number, got "wanganum" at [0]'
    )
    expect(() => asNumberwang([1])).throws(
      TypeError,
      'Expected a string, got undefined at [1]'
    )
  })
})
