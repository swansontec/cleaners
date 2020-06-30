/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import { describe, it } from 'mocha'

import {
  asArray,
  asBoolean,
  asDate,
  asEither,
  asMap,
  asNone,
  asNull,
  asNumber,
  asObject,
  asOptional,
  asString,
  asUndefined,
  asUnknown
} from '../src/index.js'

describe('asBoolean', function () {
  it('accepts only booleans', function () {
    expect(asBoolean(true)).equals(true)
    expect(asBoolean(false)).equals(false)
    expect(() => asBoolean(null)).throws(TypeError, 'Expected a boolean')
    expect(() => asBoolean('true')).throws(TypeError, 'Expected a boolean')
  })
})

describe('asNumber', function () {
  it('accepts only numbers', function () {
    expect(asNumber(0)).equals(0)
    expect(asNumber(-1)).equals(-1)
    expect(asNumber(NaN)).is.NaN
    expect(asNumber(Infinity)).equals(Infinity)
    expect(() => asNumber(null)).throws(TypeError, 'Expected a number')
    expect(() => asNumber('0')).throws(TypeError, 'Expected a number')
  })
})

describe('asString', function () {
  it('accepts only strings', function () {
    expect(asString('')).equals('')
    expect(asString('x')).equals('x')
    expect(() => asString(null)).throws(TypeError, 'Expected a string')
    expect(() => asString(0)).throws(TypeError, 'Expected a string')
  })
})

describe('asNull', function () {
  it('accepts only null', function () {
    expect(asNull(null)).equals(null)
    expect(() => asNull(undefined)).throws(TypeError, 'Expected null')
    expect(() => asNull(false)).throws(TypeError, 'Expected null')
    expect(() => asNull('null')).throws(TypeError, 'Expected null')
  })
})

describe('asUndefined', function () {
  it('accepts only undefined', function () {
    expect(asUndefined(undefined)).equals(undefined)
    expect(() => asUndefined(null)).throws(TypeError, 'Unexpected value')
    expect(() => asUndefined(false)).throws(TypeError, 'Unexpected value')
    expect(() => asUndefined('undefined')).throws(TypeError, 'Unexpected value')
  })
})

describe('asNone', function () {
  it('accepts null or undefined', function () {
    expect(asNone(null)).equals(undefined)
    expect(asNone(undefined)).equals(undefined)
    expect(() => asNone(false)).throws(TypeError, 'Unexpected value')
    expect(() => asNone('undefined')).throws(TypeError, 'Unexpected value')
  })
})

describe('asDate', function () {
  it('accepts dates', function () {
    const now = new Date()
    expect(asDate(now).valueOf()).equals(now.valueOf())
    expect(asDate('2020-02-20').valueOf()).equals(
      new Date('2020-02-20').valueOf()
    )
    expect(() => asDate(false)).throws(TypeError, 'Expected a date')
    expect(() => asDate('asfh')).throws(TypeError, 'Invalid date format')
  })
})

describe('asArray', function () {
  it('accepts arrays', function () {
    const asStringArray = asArray(asString)

    expect(asStringArray([])).deep.equals([])
    expect(asStringArray(['hey'])).deep.equals(['hey'])
    expect(() => asStringArray([1])).throws(
      TypeError,
      'Expected a string at [0]'
    )
    expect(() => asStringArray({ length: 0 })).throws(
      TypeError,
      'Expected an array'
    )
  })
})

describe('asMap', function () {
  it('accepts objects', function () {
    const asNumberMap = asMap(asNumber)

    expect(asNumberMap({ a: 1, b: 2 })).deep.equals({ a: 1, b: 2 })
    const danger = JSON.parse('{ "a": 1, "b": 2, "__proto__": 3 }')
    expect(asNumberMap(danger)).deep.equals({ a: 1, b: 2 })
    expect(() => asNumberMap(null)).throws(TypeError, 'Expected an object')
    expect(() => asNumberMap({ a: false })).throws(
      TypeError,
      'Expected a number at ["a"]'
    )
  })
})

describe('asObject', function () {
  it('accepts objects', function () {
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
    expect(() => asDemoObject(null)).throws(TypeError, 'Expected an object')
    expect(() => asDemoObject({ here: 'hi', maybe: 1 })).throws(
      TypeError,
      'Expected a string at .maybe'
    )
  })
})

describe('asOptional', function () {
  it('accepts optional values', function () {
    const asMaybeNumber = asOptional(asNumber)

    expect(asMaybeNumber(1)).equals(1)
    expect(asMaybeNumber(null)).equals(undefined)
    expect(asMaybeNumber(undefined)).equals(undefined)
    expect(() => asMaybeNumber('boom')).throws(TypeError, 'Expected a number')
  })
})

describe('asEither', function () {
  it('accepts either type', function () {
    const asUnit = asEither(asNumber, asString)

    expect(asUnit(1)).equals(1)
    expect(asUnit('1em')).equals('1em')
    expect(() => asUnit(null)).throws(TypeError, 'Expected a string')
  })
})

describe('asUnknown', function () {
  it('accepts anything', function () {
    const object = {}

    expect(asUnknown()).equals(undefined)
    expect(asUnknown(1)).equals(1)
    expect(asUnknown(object)).equals(object)
  })
})

describe('locateError', function () {
  it('makes nicely nested errors', function () {
    const asDemoObject = asObject({
      map: asMap(asArray(asNumber))
    })
    expect(() => asDemoObject({ map: { 'odd "item"': ['1'] } })).throws(
      TypeError,
      'Expected a number at .map["odd \\"item\\""][0]'
    )
  })
})
