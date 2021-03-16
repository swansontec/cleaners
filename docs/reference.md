## Quick Reference

Primitive values:

- `asBoolean` - Accepts & returns a `boolean`.
- `asNumber` - Accepts & returns a `number`.
- `asString` - Accepts & returns a `string`.
- `asNull` - Accepts & returns `null`.
- `asNone` - Accepts & returns `undefined`, but accepts `null` as well.
- `asUndefined` - Accepts & returns `undefined`.
- `asUnknown` - Accepts anything.

Arrays and objects:

- `asArray` - Builds an array cleaner.
- `asObject` - Builds an object cleaner.
- `asMap` - Deprecated alias for `asObject`.

Missing data:

- `asEither` - Builds a cleaner for an item that might have multiple types.
- `asMaybe` - Builds a cleaner that quietly ignores invalid data.
- `asOptional` - Builds a cleaner for an item that might be undefined or null.

String parsing:

- `asDate` - Accepts & returns a `Date`, but parses strings if needed.
- `asJSON` - Builds a cleaner for JSON strings.

## asArray

`asArray` accepts a single `Cleaner` that applies to each item within the array:

```js
// Makes a Cleaner<string[]>:
const asStringList = asArray(asString)
```

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

This cleaner is useful as a type guard on your data:

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

This type will silence all exceptions from the cleaner(s) it composes. Only use on types for which you do not care why a value is not valid.

## asObject

`asObject` builds an object cleaner. The cleaner will accept any Javascript object and make a clean copy.

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

To clean an object with known property names, pass a "shape" object to `asObject`. Each propery in the "shape" object should be a cleaner that applies to the matching key in the input object. The cleaner won't copy any unknown properties:

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
