# Guides

## Converting Data

Since JSON doesn't have its own date type, people usually send dates as strings:

```js
{ "birthday": "2010-04-01" }
```

It's not enough to check that `birthday` is a string - the contents need to be parsed and validated as well. Fortunately, cleaners can do this. The `asDate` cleaner will actually parse strings into Javascript date objects, solving this problem.

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

Or extra data conversions:

```js
import { asString, Cleaner } from 'cleaners'
import { base64 } from 'rfc4648'

const asBase64Data: Cleaner<Uint8Array> = raw => base64.parse(asString(raw))
```

You can pass these functions to `asObject` or any of the others helpers, and they will work perfectly, including TypeScript & Flow return-type inference.

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
