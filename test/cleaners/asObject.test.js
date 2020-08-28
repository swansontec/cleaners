import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asObject, asOptional, asString } from '../../src/index.js'

describe('asObject', function () {
  const asDemoObject = asObject({
    here: asString,
    maybe: asOptional(asString)
  })

  it('accepts objects', function () {
    expect(asDemoObject({ here: 'hi' })).deep.equals({
      here: 'hi',
      maybe: undefined
    })
    expect(asDemoObject({ here: 'hi', maybe: '!' })).deep.equals({
      here: 'hi',
      maybe: '!'
    })
  })

  it('rejects non-objects', function () {
    expect(() => asDemoObject(null)).throws(TypeError, 'Expected an object')
  })

  it('rejects invalid contents', function () {
    expect(() => asDemoObject({ here: 'hi', maybe: 1 })).throws(
      TypeError,
      'Expected a string at .maybe'
    )
  })
})
