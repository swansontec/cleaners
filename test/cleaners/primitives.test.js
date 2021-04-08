/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import { describe, it } from 'mocha'

import {
  asBoolean,
  asNone,
  asNull,
  asNumber,
  asString,
  asUndefined,
  asUnknown
} from '../../src/index.js'

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

describe('asNone', function () {
  it('accepts only null or undefined', function () {
    expect(asNone(null)).equals(undefined)
    expect(asNone(undefined)).equals(undefined)
    expect(() => asNone(false)).throws(TypeError, 'Expected null')
    expect(() => asNone('undefined')).throws(TypeError, 'Expected null')
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
    expect(() => asUndefined(null)).throws(TypeError, 'Expected undefined')
    expect(() => asUndefined(false)).throws(TypeError, 'Expected undefined')
    expect(() => asUndefined('undefined')).throws(
      TypeError,
      'Expected undefined'
    )
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
