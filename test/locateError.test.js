import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asArray, asJSON, asMap, asNumber, asObject } from '../src/index.js'

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
      expect(typeof error.addStep).equals('function')
    }
  })

  it('avoids non-error objects', function () {
    function asBomb() {
      // eslint-disable-next-line no-throw-literal
      throw { message: 'boom' }
    }
    const asDemoObject = asObject({
      payload: asBomb
    })

    try {
      asDemoObject({ payload: 'ouch' })
      throw new Error('Expecting an error')
    } catch (error) {
      expect(error).not.instanceOf(Error)
      expect(error.message).equals('boom')
      expect(typeof error.addStep).equals('undefined')
    }
  })

  it('works with JSON errors', function () {
    const asNested = asObject({ json: asJSON(asArray(asNumber)) })
    try {
      asNested({ json: '[false]' })
      throw new Error('Expecting an error')
    } catch (error) {
      expect(error.message).equals('Expected a number at JSON.parse(.json)[0]')
    }
  })
})
