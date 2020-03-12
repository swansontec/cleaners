// @flow
/* eslint-disable no-unused-vars */

import {
  asArray,
  asBoolean,
  asDate,
  asEither,
  asMap,
  asNone,
  asNull,
  asNumber,
  asObject,
  asOptional,
  asString,
  asUndefined
} from '../src/index'

type Expected = {
  boolean: boolean,
  number: number,
  string: string,
  null: null,
  undefined: void,
  none: void,
  date: Date,
  array: string[],
  map: { [key: string]: number },
  optional1: string | void,
  optional2: string,
  either: string | number
}

const cleaner = asObject({
  boolean: asBoolean,
  number: asNumber,
  string: asString,
  null: asNull,
  undefined: asUndefined,
  none: asNone,
  date: asDate,
  array: asArray(asString),
  map: asMap(asNumber),
  optional1: asOptional(asString),
  optional2: asOptional(asString, ''),
  either: asEither(asString, asNumber)
})
type Actual = $Call<typeof cleaner>

// Check that Actual and Expected are equivalent in both directions:
const checkForward = (value: Actual): Expected => value
const checkReverse = (value: Expected): Actual => value
