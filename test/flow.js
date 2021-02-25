// @flow
/* eslint-disable no-unused-vars */

import {
  asArray,
  asBoolean,
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
  asUnknown
} from '../src/index.js'

type Expected = {
  array: string[],
  date: Date,
  either: string | number,
  json: number[],
  map: { [key: string]: number },
  maybe: string | void,
  object1: { [key: string]: boolean },
  object2: { when: Date },
  object3: { when: Date },
  optional1: string | void,
  optional2: string,

  // Primitives:
  boolean: boolean,
  none: void,
  null: null,
  number: number,
  string: string,
  undefined: void,
  unknown: mixed
}

const cleaner = asObject({
  array: asArray(asString),
  date: asDate,
  either: asEither(asString, asNumber),
  json: asJSON(asArray(asNumber)),
  map: asMap(asNumber),
  maybe: asMaybe(asString),
  object1: asObject(asBoolean),
  object2: asObject({ when: asDate }),
  object3: asObject({ when: asDate }).withoutCopy,
  optional1: asOptional(asString),
  optional2: asOptional(asString, ''),

  // Primitives:
  boolean: asBoolean,
  none: asNone,
  null: asNull,
  number: asNumber,
  string: asString,
  undefined: asUndefined,
  unknown: asUnknown
})
type Actual = $Call<typeof cleaner>

// Check that Actual and Expected are equivalent in both directions:
const checkForward = (value: Actual): Expected => value
const checkReverse = (value: Expected): Actual => value
