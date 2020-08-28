import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asEither, asNumber, asString } from '../../src/index.js'

describe('asEither', function () {
  it('accepts either type', function () {
    const asUnit = asEither(asNumber, asString)

    expect(asUnit(1)).equals(1)
    expect(asUnit('1em')).equals('1em')
    expect(() => asUnit(null)).throws(TypeError, 'Expected a string')
  })
})
