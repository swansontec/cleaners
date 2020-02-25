/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import { describe, it } from 'mocha'

import {
  asArray,
  asBoolean,
  asDate,
  asEither,
  asNone,
  asNull,
  asNumber,
  asObject,
  asOptional,
  asString,
  asUndefined
} from '../src/index.js'

describe('asBoolean', function() {
  it('accepts only booleans', function() {
    expect(asBoolean(true)).equals(true)
    expect(asBoolean(false)).equals(false)
    expect(() => asBoolean(null)).throws('Expected a boolean')
    expect(() => asBoolean('true')).throws('Expected a boolean')
  })
})

describe('asNumber', function() {
  it('accepts only numbers', function() {
    expect(asNumber(0)).equals(0)
    expect(asNumber(-1)).equals(-1)
    expect(asNumber(NaN)).is.NaN
    expect(asNumber(Infinity)).equals(Infinity)
    expect(() => asNumber(null)).throws('Expected a number')
    expect(() => asNumber('0')).throws('Expected a number')
  })
})

describe('asString', function() {
  it('accepts only strings', function() {
    expect(asString('')).equals('')
    expect(asString('x')).equals('x')
    expect(() => asString(null)).throws('Expected a string')
    expect(() => asString(0)).throws('Expected a string')
  })
})

describe('asNull', function() {
  it('accepts only null', function() {
    expect(asNull(null)).equals(null)
    expect(() => asNull(undefined)).throws('Expected null')
    expect(() => asNull(false)).throws('Expected null')
    expect(() => asNull('null')).throws('Expected null')
  })
})

describe('asUndefined', function() {
  it('accepts only undefined', function() {
    expect(asUndefined(undefined)).equals(undefined)
    expect(() => asUndefined(null)).throws('Unexpected value')
    expect(() => asUndefined(false)).throws('Unexpected value')
    expect(() => asUndefined('undefined')).throws('Unexpected value')
  })
})

describe('asNone', function() {
  it('accepts null or undefined', function() {
    expect(asNone(null)).equals(undefined)
    expect(asNone(undefined)).equals(undefined)
    expect(() => asNone(false)).throws('Unexpected value')
    expect(() => asNone('undefined')).throws('Unexpected value')
  })
})

describe('asDate', function() {
  it('accepts dates', function() {
    const now = new Date()
    expect(asDate(now).valueOf()).equals(now.valueOf())
    expect(asDate('2020-02-20').valueOf()).equals(
      new Date('2020-02-20').valueOf()
    )
    expect(() => asDate(false)).throws('Expected a date')
    expect(() => asDate('asfh')).throws('Invalid date format')
  })
})

describe('asArray', function() {
  it('accepts arrays', function() {
    const asStringArray = asArray(asString)

    expect(asStringArray([])).deep.equals([])
    expect(asStringArray(['hey'])).deep.equals(['hey'])
    expect(() => asStringArray([1])).throws('Expected a string')
    expect(() => asStringArray({ length: 0 })).throws('Expected an array')
  })
})

describe('asObject', function() {
  it('accepts objects', function() {
    const asDemoObject = asObject({
      here: asString,
      maybe: asOptional(asString)
    })

    expect(asDemoObject({ here: 'hi' })).deep.equals({
      here: 'hi',
      maybe: undefined
    })
    expect(asDemoObject({ here: 'hi', maybe: '!' })).deep.equals({
      here: 'hi',
      maybe: '!'
    })
    expect(() => asDemoObject(null)).throws('Expected an object')
    expect(() => asDemoObject({ here: 'hi', maybe: 1 })).throws(
      'Expected a string'
    )
  })
})

describe('asOptional', function() {
  it('accepts optional values', function() {
    const asMaybeNumber = asOptional(asNumber)

    expect(asMaybeNumber(1)).equals(1)
    expect(asMaybeNumber(null)).equals(undefined)
    expect(asMaybeNumber(undefined)).equals(undefined)
    expect(() => asMaybeNumber('boom')).throws('Expected a number')
  })
})

describe('asEither', function() {
  it('accepts either type', function() {
    const asUnit = asEither(asNumber, asString)

    expect(asUnit(1)).equals(1)
    expect(asUnit('1em')).equals('1em')
    expect(() => asUnit(null)).throws('Expected a string')
  })
})
