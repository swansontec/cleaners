import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asArray, asDate, asJSON } from '../../src/index.js'

describe('asJSON', function () {
  const asDatesFile = asJSON(asArray(asDate))

  it('accepts JSON strings', function () {
    expect(asDatesFile('["2020-02-20"]')).deep.equals([new Date('2020-02-20')])
  })

  it('rejects non-JSON strings', function () {
    expect(() => asDatesFile(null)).throws('Expected a string')
    expect(() => asDatesFile([])).throws('Expected a string')
    expect(() => asDatesFile('[*]')).throws(
      'Unexpected token * in JSON at position 1'
    )
    expect(() => asDatesFile('')).throws('Unexpected end of JSON input')
  })

  it('rejects invalid contents', function () {
    expect(() => asDatesFile('null')).throws(
      'Expected an array at JSON.parse()'
    )
    expect(() => asDatesFile('[null]')).throws(
      'Expected a date string at JSON.parse()[0]'
    )
  })
})
