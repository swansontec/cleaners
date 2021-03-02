# cleaners

## 0.3.7 (2021-03-02)

- Re-work the asObject cleaner.
  - When passed a single cleaner function, create a key-value cleaner like `asMap`.
  - When passed a shape object, also include a `withRest` method on the generated cleaner. This method cleans the object according to the shape, but also preserves unknown properties if present.
- Deprecate `asMap`, sicne `asObject` handles this use-case now.

## 0.3.6 (2021-03-01)

- Help Deno find the Typescript definitions correctly.
- Upgrade build tooling.
- Add readme section headers.

## 0.3.5 (2021-02-19)

- Simplify the error location algorithm. Error object no longer receive a helper function, just a simple number property now.
- Add the package to deno.land, in addition to NPM.

## 0.3.4 (2021-02-19)

- Add an optional fallback to the `asMaybe` cleaner
- Fix the `asOptional` Flow types to match the TypeScript ones, where the fallback and cleaner types must match.
- Add package.json to the Node.js exports table, to fix warnings in the React Native bundler.

## 0.3.3 (2021-02-05)

- Document the problem with exporting cleaners under Flow.
- Export the `ObjectCleaner` type definition.

## 0.3.2 (2020-08-31)

- Add an `asMaybe` cleaner, which turns invalid data into `undefined`.

## 0.3.1 (2020-08-31)

- fix: Stop the Node 14 module entry point from instantly erroring.
- fix: Adjust the object cleaner type definitions to give better tooltips & errors.

## 0.3.0 (2020-08-28)

- Add an `asJSON` cleaner.
- Expose the `asObject` input shape as a `shape` property on the returned cleaner.
- Use an `Error.addStep` method to build up error locations, instead of fragile search & replace. Several cleaners now add a default `addStep` methods to `Error` objects do not have one.
- Add a native module entry point for Node 14.

## 0.2.1 (2020-06-30)

- Add an `asUnknown` cleaner.
- Improve error handling.

## 0.2.0 (2020-04-11)

- When a nested cleaner throws an error, add location information to the message.
- The `asOptional` fallback type must match the main type (for TypeScript only).

## 0.1.4 (2020-02-25)

- Fix the `asOptional` TypeScript definition broken in v0.1.3.
- Test the type definitions so they won't break in the future.

## 0.1.3 (2020-02-24)

- Add an `asMap` compound cleaner.

## 0.1.2 (2020-02-13)

- Add missing `package.json` fields, so TypeScript can find our definitions.

## 0.1.1 (2020-02-13)

- Export the correct `Cleaner` type in the Flow definitions.

## 0.1.0 (2020-02-13)

- Initial release
