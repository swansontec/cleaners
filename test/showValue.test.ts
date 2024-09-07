import { expect } from 'chai'
import { describe, it } from 'mocha'

import { showValue } from '../src/showValue.js'

describe('showValue', function () {
  it('shows simple values', function () {
    expect(showValue(false)).equals('false')
    expect(showValue(true)).equals('true')
    expect(showValue(null)).equals('null')
    expect(showValue(undefined)).equals('undefined')
  })

  it('shows numbers', function () {
    expect(showValue(Infinity)).equals('Infinity')
    expect(showValue(NaN)).equals('NaN')
    expect(showValue(1)).equals('1')
    expect(showValue(-2.5)).equals('-2.5')
    expect(showValue(20n)).equals('20')
  })

  it('shows strings', function () {
    expect(showValue('Hello')).equals('"Hello"')
    expect(showValue('"')).equals('"\\""')
  })

  it('shows objects', function () {
    expect(showValue([1, 2, 3])).equals('array')
    expect(showValue({ a: 1, b: 2 })).equals('object')
    expect(showValue(() => {})).equals('function')
  })
})
