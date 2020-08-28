import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asDate } from '../../src/index.js'

describe('asDate', function () {
  it('accepts dates', function () {
    const now = new Date()
    const result = asDate(now)

    expect(result).instanceOf(Date)
    expect(now.valueOf()).equals(now.valueOf())
  })

  it('accepts strings', function () {
    const before = new Date('2020-02-20')
    const result = asDate('2020-02-20')

    expect(result).instanceOf(Date)
    expect(result.valueOf()).equals(before.valueOf())
  })

  it('rejects non-dates and non-strings', function () {
    expect(() => asDate(false)).throws(TypeError, 'Expected a date')
  })

  it('rejects invalid dates', function () {
    expect(() => asDate('asfh')).throws(TypeError, 'Invalid date format')
  })
})
