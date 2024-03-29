# Guides

## Installing Cleaners

If you are using Node, first install the package using `npm i cleaners` or `yarn add cleaners`, and then import it using either syntax:

```js
// The old-school way:
const { asString } = require('cleaners')

// Or using Node's new native module support:
import { asString } from 'cleaners'
```

If you are using Deno, just import cleaners directly:

```js
import { asString } from 'https://deno.land/x/cleaners/mod.ts'
```

## Writing Custom Cleaners

Since cleaners are just functions, you can easily create your own as well, which is useful if you need extra data validation:

```js
function asEvenNumber(raw: any): number {
  if (typeof raw !== 'number' || raw % 2 !== 0) {
    throw new TypeError('Expected an even number')
  }
  return raw
}
```

You can pass this function to `asObject` or any of the others helpers, and they will work perfectly, including TypeScript & Flow return-type inference.

If your cleaner performs data conversions, wrap it in the `asCodec` helper:

```js
import { asString, Cleaner } from 'cleaners'
import { base64 } from 'rfc4648'

const asBase64: Cleaner<Uint8Array> = asCodec(
  raw => base64.parse(asString(raw))
  clean => base64.stringify(clean)
)
```

The first parameter to `asCodec` is the cleaner, and the second parameter is the un-cleaner.

## Recursive Cleaners

Sometimes cleaners need to refer to themselves, such as for recursive objects:

```js
const asSection = asObject({
  title: asString,
  // ReferenceError: Cannot access 'asSection' before initialization:
  subsections: asArray(asSection)
})
```

The solution is to break the recursion using a temporary function:

```js
const asSection = asObject({
  title: asString,
  subsections: asArray(raw => asSection(raw))
})
```

## Exporting Cleaners in Flow

If you want to export cleaners between files in Flow, you may run into errors. This is because Flow [requires explicit type definitions for all exports](https://medium.com/flow-type/types-first-a-scalable-new-architecture-for-flow-3d8c7ba1d4eb) (unlike TypeScript):

```js
// This works, since it's not exported:
const asNumbers = asArray(asNumber)

// Flow "Cannot build a typed interface for this module":
export const asNumbers = asArray(asNumber)

// This works again:
export const asNumbers: Cleaner<number[]> = asArray(asNumber)
```

These explicit type definitions are redundant but not harmful, since Flow does check that they match the actual cleaner on the right.
