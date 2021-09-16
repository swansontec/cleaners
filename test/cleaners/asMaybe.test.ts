import { expect } from 'chai'
import { describe, it } from 'mocha'

import {
  asBoolean,
  asDate,
  asMaybe,
  asNumber,
  asObject,
  asString
} from '../../src/index.js'

describe('asMaybe', function () {
  const asMaybeNumber = asMaybe(asNumber)
  const asMaybeString = asMaybe(asString)
  const asMaybeDate = asMaybe(asDate)
  const asMaybeObject = asMaybe(
    asObject({
      onlyProperty: asBoolean
    })
  )

  it('can type-guard types', function () {
    // Numbers
    expect(asMaybeNumber(123)).equals(123)
    expect(asMaybeNumber('123')).equals(undefined)

    // String
    expect(asMaybeString('123')).equals('123')
    expect(asMaybeString(123)).equals(undefined)

    // Date
    expect(asMaybeDate(new Date())).instanceOf(Date)
    expect(asMaybeDate('invalid date')).equals(undefined)

    // Object
    expect(asMaybeObject({ onlyProperty: true })).deep.equals({
      onlyProperty: true
    })
    expect(asMaybeObject({ onlyProperty: 'is not valid' })).deep.equals(
      undefined
    )
    expect(asMaybeObject({ missingOnlyProperty: true })).deep.equals(undefined)
  })

  it('will clean data', function () {
    // Object
    expect(
      asMaybeObject({ onlyProperty: true, withOtherProperty: true })
    ).deep.equals({
      onlyProperty: true
    })
    // Date
    expect(asMaybeDate('10-10-2020')).instanceOf(Date)
  })
})
