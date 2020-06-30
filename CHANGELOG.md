# cleaners

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
