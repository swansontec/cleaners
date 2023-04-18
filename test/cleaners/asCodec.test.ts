import { expect } from 'chai'
import { describe, it } from 'mocha'

import {
  asCodec,
  asDate,
  asJSON,
  asObject,
  asString,
  uncleaner
} from '../../src/index.js'

describe('asCodec', function () {
  it('can be called manually', function () {
    const asHex = asCodec<number>(
      raw => {
        const clean = asString(raw)
        if (!/^0x[0-9A-Fa-f]+$/.test(raw)) {
          throw new Error('Expected a hex string')
        }
        return parseInt(clean.slice(2), 16)
      },
      clean => '0x' + clean.toString(16)
    )
    const wasHex = uncleaner(asHex)

    expect(() => asHex(null)).throws('Expected a string')
    expect(() => asHex('z')).throws('Expected a hex string')
    expect(asHex('0x7f')).equals(127)
    expect(wasHex(127)).equals('0x7f')
  })

  it('round-trips data', function () {
    const asFile = asJSON(asObject({ lastLogin: asDate }))
    const wasFile = uncleaner(asFile)
    const raw = '{"lastLogin":"2020-02-20T00:00:00.000Z"}'

    const clean = asFile(raw)
    expect(clean).deep.equals({ lastLogin: new Date('2020-02-20') })
    expect(wasFile(clean)).deep.equals(raw)
  })
})
