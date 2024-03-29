# cleaners

[![Build Status](https://travis-ci.com/swansontec/cleaners.svg?branch=master)](https://travis-ci.com/swansontec/cleaners)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Cleans & validates untrusted data, with TypeScript & Flow support

Do you ever read JSON data from the outside world? If you, you should probably clean & validate that data before you start using it. That can be a lot of work, so `cleaners` is here to help with:

- Validation - Ensuring that the input data matches the expected format.
- Cleaning - Inserting fallback values, parsing strings into Date objects, and so forth.
- Typing - Automatically generating TypeScript & Flow types.

## What is a Cleaner?

A cleaner is just an ordinary JavaScript function that validates some data. If the data is good, the cleaner returns it. If the data is bad, the the cleaner throws an exception. Here is an example:

```js
import { asString } from 'cleaners'

asString('hey') // Returns 'hey'
asString(1) // TypeError: Expected a string
```

## Building Cleaners

Cleaners are composable, which means smaller cleaners can be built into bigger cleaners:

```js
import { asArray, asNumber, asObject, asOptional } from 'cleaners'

const asMessage = asObject({
  message: asString,
  title: asOptional(asString), // Optional string
  recipients: asArray(asString), // Array of strings
  replyCount: asOptional(asNumber, 0) // Number with default value
})
```

This example creates an `asMessage` function, which validates an object and returns a "clean" copy. The clean copy will have extra properties removed, and will receive default values for missing properties like `replyCount`:

```js
// Returns { message: 'hey', recipients: ['alice'], replyCount: 0 }:
asMessage({ message: 'hey', recipients: ['alice'] })

// TypeError: Expected a string at .recipients[0]:
asMessage({ message: 'boom', recipients: [null] })
```

Cleaner functions like `asMessage` are useful for checking data from the network:

```js
async function getMessage(id: string) {
  const response = await fetch(`https://some-api/message/${id}`)
  return asMessage(await response.json())
}
```

If the server sends bad data, this example will simply throw an exception rather than return data in the wrong format. Even if the server sends malicious properties like `__proto__`, the cleaner will simply filter those out.

## Automatic Type Definitions

Thanks to our TypeScript & Flow support, the `asMessage` function above has a detailed return type. The means you will get the same error-checking & auto-completion as if you had entered the following type declaration by hand:

```js
interface Message {
  text: string
  title: string | undefined
  recipients: string[]
  replyCount: number
}
```

If you want to give names to these automatically-created types, use code like the following:

```js
// Typescript:
type Message = ReturnType<typeof asMessage>

// Flow:
type Message = $Call<typeof asMessage>
```

## Converting Data

Since JSON doesn't have its own date type, people usually send dates as strings:

```js
{ "birthday": "2010-04-01" }
```

It's not enough to check that `birthday` is a string - the contents need to be parsed and validated as well. Fortunately, cleaners can do this. The `asDate` cleaner will actually parse strings into JavaScript `Date` objects, solving this problem.

## Uncleaning

When cleaners do additional data conversions, such as parsing strings into dates, it is useful to be able to undo those conversions. For instance, if a cleaner parses data from disk, those changes need to be undone before writing the file back to disk.

To handle cases like this, use the `uncleaner` function:

```js
const asFile = asJSON(asObject({ lastLogin: asDate }))
const wasFile = uncleaner(asFile)
```

The `wasFile` function will undo the conversions performed in the `asFile` cleaner. In this example, it will convert the date back into a string, and then encode everything back into JSON.

```js
// Read & parse the file:
const file = asFile(fs.readFileSync('lastLogin.json', 'utf8'))

// Make changes:
console.log(file.lastLogin)
file.lastLogin = new Date()

// Re-encode and write the file:
fs.writeFileSync('lastLogin.json', wasFile(file))
```
