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
  asTuple,
  asUndefined,
  asUnknown,
  asValue
} from '../src/index.js'

const asUnixDate = asCodec(
  raw => new Date(1000 * asNumber(raw)),
  clean => clean.valueOf() / 1000
)

interface Expected {
  array: string[]
  date: Date
  unixDate: Date
  either: string | number
  json: number[]
  map: { [key: string]: number }
  maybe: string | undefined
  object1: { [key: string]: boolean }
  object2: { when: Date }
  object3: { when: Date }
  optional1: string | undefined
  optional2: string
  tuple: [string, number]

  booleanValue: true
  numberValue: 123
  stringValue: 'foo'
  nullValue: null
  undefinedValue: undefined
  enumValue: 'small' | 'medium' | 'large'

  // Primitives:
  boolean: boolean
  number: number
  string: string
  none: undefined
  null: null
  undefined: undefined
  unknown: unknown
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
  tuple: asTuple(asString, asNumber),

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
type Actual = ReturnType<typeof cleaner>

// Check that Actual and Expected are equivalent in both directions:
const checkForward = (value: Actual): Expected => value
const checkReverse = (value: Expected): Actual => value

const value = cleaner(undefined)
checkForward(value)
checkReverse(value)
