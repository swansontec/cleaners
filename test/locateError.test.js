import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asArray, asMap, asNumber, asObject } from '../src/index.js'

describe('locateError', function () {
  it('makes nicely nested errors', function () {
    const asDemoObject = asObject({
      map: asMap(asArray(asNumber))
    })

    try {
      asDemoObject({ map: { 'odd "item"': ['1'] } })
      throw new Error('Expecting an error')
    } catch (error) {
      expect(error.message).equals(
        'Expected a number at .map["odd \\"item\\""][0]'
      )
    }
  })

  it('avoids non-error objects', function () {
    function asBomb() {
      // eslint-disable-next-line no-throw-literal
      throw null
    }
    const asDemoObject = asObject({
      payload: asBomb
    })

    try {
      asDemoObject({ payload: 'ouch' })
      throw new Error('Expecting an error')
    } catch (error) {
      expect(error).not.instanceOf(Error)
    }
  })
})
