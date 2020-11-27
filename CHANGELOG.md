# cleaners

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
