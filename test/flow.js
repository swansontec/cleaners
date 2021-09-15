// @flow

import {
  asArray,
  asBoolean,
  asCodec,
  asDate,
  asEither,
  asJSON,
  asMap,
  asMaybe,
  asNone,
  asNull,
  asNumber,
  asObject,
  asOptional,
  asString,
  asUndefined,
  asUnknown,
  asValue
} from '../src'

const asUnixDate = asCodec(
  raw => new Date(1000 * asNumber(raw)),
  clean => clean.valueOf() / 1000
)

type Expected = {
  array: string[],
  date: Date,
  unixDate: Date,
  either: string | number,
  json: number[],
  map: { [key: string]: number },
  maybe: string | void,
  object1: { [key: string]: boolean },
  object2: { when: Date },
  object3: { when: Date },
  optional1: string | void,
  optional2: string,

  booleanValue: true,
  numberValue: 123,
  stringValue: 'foo',
  nullValue: null,
  undefinedValue: void,
  enumValue: 'small' | 'medium' | 'large',

  // Primitives:
  boolean: boolean,
  number: number,
  string: string,
  none: void,
  null: null,
  undefined: void,
  unknown: mixed
}

const cleaner = asObject({
  array: asArray(asString),
  date: asDate,
  unixDate: asUnixDate,
  either: asEither(asString, asNumber),
  json: asJSON(asArray(asNumber)),
  map: asMap(asNumber),
  maybe: asMaybe(asString),
  object1: asObject(asBoolean),
  object2: asObject({ when: asDate }),
  object3: asObject({ when: asDate }).withRest,
  optional1: asOptional(asString),
  optional2: asOptional(asString, ''),

  booleanValue: asValue(true),
  numberValue: asValue(123),
  stringValue: asValue('foo'),
  nullValue: asValue(null),
  undefinedValue: asValue(undefined),
  enumValue: asValue('small', 'medium', 'large'),

  // Primitives:
  boolean: asBoolean,
  number: asNumber,
  string: asString,
  none: asNone,
  null: asNull,
  undefined: asUndefined,
  unknown: asUnknown
})
type Actual = $Call<typeof cleaner>

// Check that Actual and Expected are equivalent in both directions:
const checkForward = (value: Actual): Expected => value
const checkReverse = (value: Expected): Actual => value

const value = cleaner(undefined)
checkForward(value)
checkReverse(value)
