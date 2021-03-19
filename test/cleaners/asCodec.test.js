import { expect } from 'chai'
import { describe, it } from 'mocha'

import { asDate, asJSON, asObject, uncleaner } from '../../src/index.js'

describe('asCodec', function () {
  const asFile = asJSON(asObject({ lastLogin: asDate }))
  const wasFile = uncleaner(asFile)

  it('round-trips data', function () {
    const raw = '{"lastLogin":"2020-02-20T00:00:00.000Z"}'

    const clean = asFile(raw)
    console.log(clean.lastLogin)
    expect(clean).deep.equals({ lastLogin: new Date('2020-02-20') })
    expect(wasFile(clean)).deep.equals(raw)
  })
})
