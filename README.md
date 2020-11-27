# cleaners

[![Build Status](https://travis-ci.com/swansontec/cleaners.svg?branch=master)](https://travis-ci.com/swansontec/cleaners)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Cleans & validates untrusted data, with TypeScript & Flow support

Do you ever read JSON data from the outside world? If you, you should probably clean & validate that data before you start using it. That can be a lot of work, so `cleaners` is here to help with:

- Validation - Ensuring that the input data matches the expected format.
- Cleaning - Inserting fallback values, parsing strings into Date objects, and so forth.
- Typing - Automatically generating TypeScript & Flow types.

If features:

- Zero external dependencies
- 100% test coverage
- 0.8K minified + gzip

## Overview

This library contains a collection of composable `Cleaner` functions. A cleaner function validates some incoming data, and either returns it with the proper type or throws an exception. Here are some simple examples:

```typescript
import { asDate, asString } from 'cleaners'

const a = asString('hey') // Returns the string 'hey'
const b = asString(1) // Throws a TypeError
const c = asDate('2020-02-20') // Returns a Javascript Date object
```

To handle objects, arrays, and other nested data types, this library includes some helpers for combining `Cleaner` functions together:

```typescript
import { asArray, asObject, asOptional } from 'cleaners'

// Define a cleaner function for our custom object type:
const asMessage = asObject({
  text: asString,
  recipients: asArray(asString), // Array of strings
  seenOn: asOptional(asDate), // Optional Date
  replyCount: asOptional(asNumber, 0) // Number with default value
})

// Let's clean some network data:
try {
  const response = await fetch('https://message-api')
  const message = asMessage(await response.json())
} catch (error) {}
```

### Automatic type definitions

Thanks to our TypeScript & Flow support, the custom `asMessage` function above has a detailed return type. The means you will get the same error-checking & auto-completion as if you had entered the following type declaration by hand:

```typescript
interface Message {
  text: string
  recipients: string[]
  seenOn: Date | undefined
  replyCount: number
}
```

If you want to give names to these automatically-created types, use code like the following:

```typescript
// Typescript:
type Message = ReturnType<typeof asMessage>

// Flow:
type Message = $Call<typeof asMessage>
```

### Hand-written cleaners

Since cleaners are just functions, you can easily create your own as well, which is useful if you need extra data validation:

```typescript
function asEvenNumber(raw: any): number {
  if (typeof raw !== 'number' || raw % 2 !== 0) {
    throw new TypeError('Expected an even number')
  }
  return raw
}
```

Or extra data conversions:

```typescript
import { asString, Cleaner } from 'cleaners'
import { base64 } from 'rfc4648'

const asBase64Data: Cleaner<Uint8Array> = raw => base64.parse(asString(raw))
```

You can pass these functions to `asObject` or any of the others helpers, and they will work perfectly, including TypeScript & Flow return-type inference.

## Basic cleaners

This library includes the following basic cleaner functions:

- `asBoolean` - accepts & returns a `boolean`.
- `asNumber` - accepts & returns a `number`.
- `asString` - accepts & returns a `string`.
- `asDate` - accepts & returns a `Date`, but parses strings if needed.
- `asNull` - accepts & returns `null`.
- `asNone` - accepts & returns `undefined`, but accepts `null` as well.
- `asUndefined` - accepts & returns `undefined`.
- `asUnknown` - accepts anything.

## Compound cleaners

Compound cleaners don't clean data directly, but they _create_ cleaners that can handle the data type. This library includes a few:

- `asArray` - Builds an array cleaner.
- `asObject` - Builds a cleaner for objects with a specific shape.
- `asMap` - Builds a cleaner for an object used as key / value map.
- `asOptional` - Builds a cleaner for an item that might be undefined or null.
- `asEither` - Builds a cleaner for an item that might have multiple types.
- `asMaybe` - Builds a cleaner that quietly ignores invalid data.
- `asJSON` - Builds a cleaner for JSON strings.

`asArray` accepts a single `Cleaner` that applies to each item within the array:

```typescript
// Makes a Cleaner<string[]>:
const asStringList = asArray(asString)
```

`asMap` creates a cleaner for generic key / value objects. It accepts a single `Cleaner` that applies to each value within the object:

```typescript
// Makes a Cleaner<{ [key: string]: number }>:
const asNumberMap = asMap(asNumber)
const a = asNumberMap({ a: 1, b: 2 }) // Returns { a: 1, b: 2 }
const a = asNumberMap({ a: false }) // Throws a TypeError
```

`asObject` accepts a "shape" object, and builds a matching cleaner. For every property in the shape object, the cleaner will grab the matching property off of the input object, clean it, and add it to the output. The cleaner won't copy any unknown properties:

```typescript
// Makes a Cleaner<{ key: string }>:
const asThing = asObject({ key: asString })

// Returns { key: 'string' }, with b removed:
const x = asThing({ key: 'string', b: false })
```

The cleaners returned from `asObject` also have a `shape` property. This makes it possible to build bigger object cleaners out of smaller object cleaners:

```typescript
const asBiggerThing = asObject({
  // Give BiggerThing has all the properties of Thing:
  ...asThing.shape,
  extraProperty: asNumber
})
```

`asOptional` creates a cleaner that handles optional values. If the value to clean is `null` or `undefined`, it returns the fallback (which defaults to `undefined`). Otherwise, it cleans the value & returns it like normal:

```typescript
// Makes a Cleaner<number>:
const asCounter = asOptional(asNumber, 0)

// Makes a Cleaner<number | void>:
const asMaybeNumber = asOptional(asNumber)

const a = asCounter(1) // returns 1
const b = asCounter(null) // returns 0
const b = asMaybeNumber(null) // returns undefined
```

`asEither` creates a cleaner that handles multiple options. It tries the first cleaner, and if that throws an exception, it tries the second cleaner:

```typescript
// Makes a Cleaner<string | number>:
const asUnit = asEither(asString, asNumber)

const a = asUnit(1) // returns 1
const b = asUnit('1rem') // returns '1rem'
const c = asUnit(null) // Throws a TypeError
```

`asMaybe` creates a cleaner that doesn't throw on an invalid type. It tries the cleaner, and if that throws an exception, it will return undefined instead:

```typescript
// Makes a Cleaner<string | undefined>:
const asMaybeString = asMaybe(asString)

const a = asMaybe('Valid string') // returns 'Valid string'
const b = asMaybe(23) // returns undefined
const c = asMaybe(null) // returns undefined
```

This cleaner is useful as a type guard on your data:

```typescript
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

`asJSON` accepts a string, which it parses as JSON and passes to the nested cleaner:

```typescript
// Makes a Cleaner<string[]>:
const asNamesFile = asJSON(asArray(asString))

const a = asNamesFile('["jack","jill"]') // returns ['jack', 'jill']
const b = asNamesFile([]) // TypeError: Expected a string

// Returns an array of strings, right from disk:
const names = asNamesFile(fs.readFileSync('names.json', 'utf8'))
```
