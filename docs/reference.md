## Quick Reference

Primitive values:

- `asBoolean` - Accepts & returns a `boolean`.
- `asNumber` - Accepts & returns a `number`.
- `asString` - Accepts & returns a `string`.
- `asNull` - Accepts & returns `null`.
- `asUndefined` - Accepts & returns `undefined`.
- `asUnknown` - Accepts anything.
- [`asValue`](#asValue) - Builds a cleaner that accepts a literal value.

Data structures:

- [`asArray`](#asArray) - Builds an array cleaner.
- [`asObject`](#asObject) - Builds an object cleaner.
- [`asTuple`](#asTuple) - Builds a fixed-length array cleaner.

Branching:

- [`asEither`](#asEither) - Builds a cleaner for an item that might have multiple types.
- [`asMaybe`](#asMaybe) - Builds a cleaner that quietly ignores invalid data.
- [`asOptional`](#asOptional) - Builds a cleaner for an item that might be undefined or null.

Parsing:

- [`asCodec`](#asCodec) - Builds a cleaner that can undo its own data conversion.
- `asDate` - Accepts & returns a `Date`, but parses strings if needed.
- [`asJSON`](#asJSON) - Builds a cleaner for JSON strings.
- [`uncleaner`](#uncleaner) - Builds an uncleaner function, which reverses the effect of a cleaner.

Deprecated:

- `asMap` - Renamed to [`asObject`](#asObject).
- `asNone` - Use `asOptional(asNull)` instead.

## asArray

`asArray` accepts a single `Cleaner` that applies to each item within the array:

```js
// Makes a Cleaner<string[]>:
const asStringList = asArray(asString)
```

## asCodec

`asCodec` creates a cleaner that can undo its own data conversion. This is useful for cleaners that parse strings or similar things.

```js
// Converts UNIX timestamps to / from  JavaScript Date objects:
const asUnixDate: Cleaner<Date> = asCodec(
  raw => new Date(1000 * asNumber(raw)),
  clean => clean.valueOf() / 1000
)
```

The first parameter to `asCodec` is the regular cleaner function, which accepts raw data and returns clean data. The second parameter is the un-cleaner function, which turns the clean data (a `Date` in the example above) back into raw data (a UNIX timestamp in this case).

To get access to the un-cleaner, see `uncleaner`.

## asEither

`asEither` creates a cleaner that handles multiple options. It tries the first cleaner, and if that throws an exception, it tries the second cleaner:

```js
// Makes a Cleaner<string | number>:
const asUnit = asEither(asString, asNumber)

asUnit(1) // returns 1
asUnit('1rem') // returns '1rem'
asUnit(null) // Throws a TypeError
```

## asJSON

`asJSON` accepts a string, which it parses as JSON and passes to the nested cleaner:

```js
// Makes a Cleaner<string[]>:
const asNamesFile = asJSON(asArray(asString))

asNamesFile('["jack","jill"]') // returns ['jack', 'jill']
asNamesFile([]) // TypeError: Expected a string

// Returns an array of strings, right from disk:
const names = asNamesFile(fs.readFileSync('names.json', 'utf8'))
```

## asMaybe

`asMaybe` creates a cleaner that doesn't throw on an invalid type. It tries the cleaner, and if that throws an exception, it will return undefined instead:

```js
// Makes a Cleaner<string | undefined>:
const asMaybeString = asMaybe(asString)

asMaybe('Valid string') // returns 'Valid string'
asMaybe(23) // returns undefined
asMaybe(null) // returns undefined
```

Alternatively, you can provide a fallback value:

```js
const asSize = asMaybe(asValue('small', 'medium', 'large'), 'medium')

asSize('large') // returns 'large'
asSize('bad') // returns 'medium'
```

If the fallback value is an array or an object, consider providing a fallback function instead of a fallback value. This function will return a fresh fallback value each time there is a problem:

```js
const asSafeNumbers = asMaybe(
  asArray(asNumber),
  // Generate a fresh fallback array each time:
  () => []
)

const fallback = asSafeNumbers('bad') // returns []
fallback.push(1) // This is safe to do, since the array is unique
```

This cleaner is useful if you just want to ignore invalid values.

This cleaner is also useful if you your data could be one of several options, and you aren't sure which one it is:

```js
const pizza = asMaybe(asPizza)(obj)
const salad = asMaybe(asSalad)(obj)

if (pizza != null) {
  // It's a pizza
} else if (salad != null) {
  // It's a salad
} else {
  // It's neither
}
```

## asObject

`asObject` builds an object cleaner. The cleaner will accept any JavaScript object and make a clean copy.

If `asObject` receives a single cleaner as its parameter, it will apply that cleaner to each property in the object. This is useful when objects act as key / value maps:

```js
// Makes a Cleaner<{ [key: string]: number }>:
const asNumberMap = asObject(asNumber)

// Returns { a: 1, b: 2 }:
asNumberMap({ a: 1, b: 2 })

// TypeError: Expected a number at ["a"]:
asNumberMap({ a: false })
```

You can use `asObject(asUnknown)` if you just want to check that something is an object, and don't care what its contents are.

To clean an object with known property names, pass a "shape" object to `asObject`. Each property in the "shape" object should be a cleaner that applies to the matching key in the input object. The cleaner won't copy any unknown properties:

```js
// Makes a Cleaner<{ key: string }>:
const asThing = asObject({ key: asString })

// Returns { key: 'string' }, with "extra" removed:
asThing({ key: 'string', extra: false })
```

When `asObject` receives a shape argument, it also add it to the returned cleaner as a `shape` property. The `shape` property makes it possible to build bigger object cleaners out of smaller object cleaners:

```js
const asBiggerThing = asObject({
  extraProperty: asNumber,

  // Also give BiggerThing has all the properties of Thing:
  ...asThing.shape
})
```

In addition to the `shape` property, the returned cleaner will have a `withRest` method, which does the same thing as the cleaner, but also preserves unknown properties:

```js
// Returns `{ key: 'string', extra: false }`,
// even though `asThing.shape` doesn't have an "extra" property:
asThing.withRest({ key: 'string', extra: false })
```

This is useful when you only want to clean some of the properties on an object, but not others.

## asOptional

`asOptional` creates a cleaner that handles optional values. If the value to clean is `null` or `undefined`, it returns the fallback (which defaults to `undefined`). Otherwise, it cleans the value & returns it like normal:

```js
// Makes a Cleaner<number>:
const asCounter = asOptional(asNumber, 0)

asCounter(1) // returns 1
asCounter(null) // returns 0

// Makes a Cleaner<number | void>:
const asMaximum = asOptional(asNumber)

asMaximum(null) // returns undefined
```

If the fallback value is an array or an object, consider providing a fallback function instead of a fallback value. This function will return a fresh fallback value each time there is a problem:

```js
const asNumbers = asOptional(
  asArray(asNumber),
  // Generate a fresh fallback array each time:
  () => []
)

const fallback = asNumbers(undefined) // returns []
fallback.push(1) // This is safe to do, since the array is unique
```

## asTuple

`asTuple` creates a cleaner that accepts fixed-length arrays where each position can have a different type. It accepts multiple arguments, one for each position in the array:

```js
const asOptions = asTuple(asString, asNumber)

asOptions(['add', 1]) // returns ['add', 1]
asOptions([1, 0]) // TypeError: Expected a string at [0]
```

Sadly, Flow has trouble inferring the `asTuple` return type (but Typescript works fine). To avoid returning overly loose types like `Array<number | string>` instead of `[string, number]`, Flow needs explicit type annotations:

```js
// Only Flow needs this:
const asOptions: Cleaner<[string, number]> = asTuple(asString, asNumber)
```

## asValue

`asValue` creates a cleaner that accepts a specific literal value:

```js
const asTrue = asValue(true)

asTrue(true) // returns true
asTrue(false) // TypeError: Expected true
```

Passing multiple arguments to `asValue` will create an enum cleaner that accepts any of the provided values:

```js
const asSize = asValue('small', 'medium', 'large')

asSize('large') // returns 'large'
asSize('huge') // TypeError: Expected one of: 'small' | 'medium' | 'large'
```

Sadly, Flow has trouble inferring the `asValue` return type (but Typescript works fine). To avoid producing overly-broad types like `Cleaner<string>`, Flow needs explicit type annotations:

```js
// Only Flow needs this:
const asTrue: Cleaner<true> = asValue<true>
const asTeam: Cleaner<'red' | 'blue'> = asValue('red', 'blue')
```

## uncleaner

The `uncleaner` turns a cleaner into an un-cleaner.

```js
const asThing: Cleaner<T> = ...
const wasThing: Uncleaner<T> = uncleaner(asThing)
```

This un-cleaner will un-do any data conversions (such as string parsing) performed by the cleaner.

Un-cleaners have the opposite data types as their corresponding cleaner. Since all cleaners accept `unknown` and return some known type `T`, the matching un-cleaner will accept type `T` and return `unknown`.
