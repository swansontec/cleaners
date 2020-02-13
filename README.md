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
- 0.5K minified + gzip

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

Thanks to our TypeScript & Flow support, the custom `asMessage` function has a detailed return type. The means you will get the same error-checking & auto-completion as if you had entered the following type declaration by hand:

```typescript
declare function asMessage(raw: any): {
  text: string
  recipients: string[]
  seenOn: Date | undefined
  replyCount: number
}
```

In other words, not only does this library make it super-easy to write validation functions, but it also gives you the matching TypeScript / Flow types for free!

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
- `asNull` - accepts & returns `null`.
- `asNumber` - accepts & returns a `number`.
- `asString` - accepts & returns a `string`.
- `asUndefined` - accepts & returns `undefined`.
- `asNone` - accepts & returns `undefined`, but accepts `null` as well.
- `asDate` - accepts & returns a `Date`, but parses strings if needed.

## Compound cleaners

Compound cleaners don't clean data directly, but they *create* cleaners that can handle the data type. This library includes a few:

- `asArray`
- `asObject`
- `asOptional`
- `asEither`

`asArray` accepts a single `Cleaner` that applies to each item within the array:

```typescript
// Makes a Cleaner<string[]>:
const asStringList = asArray(asString)
```

`asObject` creates an object cleaner. `asObject` accepts object which describes the cleaner to build. The object's keys are property names, and the object's values are `Cleaner` functions to apply to those properties. The generated cleaner removes unknown properties for safety:

```typescript
// Makes a Cleaner<{ key: string }>:
const asThing = asObject({ key: asString })

// Returns { key: 'string' }, with b removed:
const x = asThing({ key: 'string', b: false })
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
