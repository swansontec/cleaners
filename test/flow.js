// @flow
/* eslint-disable no-unused-vars */

import {
  asArray,
  asBoolean,
  asDate,
  asEither,
  asJSON,
  asLiteral,
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
} from '../src'

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

  literal1: 'foo',
  literal2: 'bar',
  literal3: 123,
  literal4: null,
  literal5: void,

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
  object3: asObject({ when: asDate }).withRest,
  optional1: asOptional(asString),
  optional2: asOptional(asString, ''),

  literal1: asLiteral('foo'),
  literal2: asLiteral('bar'),
  literal3: asLiteral(123),
  literal4: asLiteral(null),
  literal5: asLiteral(undefined),

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
