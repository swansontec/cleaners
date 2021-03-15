import { expect } from 'chai'
import { describe, it } from 'mocha'

import {
  asMap,
  asNumber,
  asObject,
  asOptional,
  asString
} from '../../src/index.js'

describe('asObject', function () {
  const asNumberMap = asObject(asNumber)
  const asDemoObject = asObject({
    here: asString,
    maybe: asOptional(asString)
  })

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

  it('accepts shaped objects', function () {
    // Optional property:
    expect(asDemoObject({ here: 'hi' })).deep.equals({
      here: 'hi',
      maybe: undefined
    })

    // All properties:
    const data = { here: 'hi', maybe: '!', extra: false }
    expect(asDemoObject(data)).deep.equals({
      here: 'hi',
      maybe: '!'
    })
    expect(asDemoObject.withRest(data)).deep.equals(data)

    // Filters __proto__:
    expect(
      asDemoObject.withRest(
        JSON.parse(
          '{ "here": "hi", "maybe": "!", "extra": false, "__proto__": false }'
        )
      )
    ).deep.equals(data)
  })

  it('rejects shaped non-objects', function () {
    expect(() => asDemoObject(null)).throws(TypeError, 'Expected an object')
    expect(() => asDemoObject.withRest(null)).throws(
      TypeError,
      'Expected an object'
    )
  })

  it('rejects invalid shaped contents', function () {
    expect(() => asDemoObject({ here: 'hi', maybe: 1 })).throws(
      TypeError,
      'Expected a string at .maybe'
    )
  })

  it('has an asMap alias', function () {
    const asDemoObject2 = asMap(asDemoObject.shape)
    const data = { here: 'hi', maybe: '!', extra: false }
    expect(asDemoObject2(data)).deep.equals({
      here: 'hi',
      maybe: '!'
    })
    expect(asDemoObject2.withRest(data)).deep.equals(data)
  })
})
