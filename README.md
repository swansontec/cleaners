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
- 1K minified + gzip
- [Documentation](https://cleaners.js.org)

### Installing

If you are using Deno, just import cleaners directly:

```js
import { asString } from 'https://deno.land/x/cleaners/mod.ts'
```

If you are using Node, first install the package using `npm i cleaners` or `yarn add cleaners`, and then import it using either syntax:

```js
// The oldschool way:
const { asString } = require('cleaners')

// Or using Node's new native module support:
import { asString } from 'cleaners'
```

## Overview

[See the documentation website for details](https://cleaners.js.org), but here is a quick overview:

This library contains a collection of composable `Cleaner` functions. A cleaner function validates some incoming data, and either returns it with the proper type or throws an exception. Here are some simple examples:

```js
import { asDate, asString } from 'cleaners'

asString('hey') // Returns 'hey'
asString(1) // TypeError: Expected a string
asDate('2020-02-20') // Returns a JavaScript Date object
```

To handle objects, arrays, and other nested data types, this library includes some helpers for combining `Cleaner` functions together:

```js
import { asArray, asNumber, asObject, asOptional } from 'cleaners'

const asMessage = asObject({
  message: asString,
  title: asOptional(asString), // Optional string
  recipients: asArray(asString), // Array of strings
  replyCount: asOptional(asNumber, 0) // Number with default value
})

// Let's clean some network data:
try {
  const response = await fetch('https://message-api')
  const message = asMessage(await response.json())
} catch (error) {}
```

Thanks to our TypeScript & Flow support, the custom `asMessage` function above has a detailed return type. The means you will get the same error-checking & auto-completion as if you had entered the following type declaration by hand:

```typescript
interface Message {
  text: string
  title: string | undefined
  recipients: string[]
  replyCount: number
}
```
