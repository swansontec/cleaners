// type names ----------------------------------------------------------------

/**
 * Reads & checks an untrusted value. Throws an exception if it's wrong.
 */
export declare type Cleaner<T> = (raw: any) => T

/**
 * Undoes the effect of a cleaner.
 */
export declare type Uncleaner<T> = (clean: T) => any

declare type CleanerShape<T> = {
  [K in keyof T]: Cleaner<T[K]>
}

/**
 * A cleaner, but with an extra `shape` property:
 */
export declare interface ObjectCleaner<T> extends Cleaner<T> {
  readonly shape: CleanerShape<T>
  readonly withRest: Cleaner<T>
}

// simple types --------------------------------------------------------------

export declare const asBoolean: Cleaner<boolean>
export declare const asNone: Cleaner<undefined>
export declare const asNull: Cleaner<null>
export declare const asNumber: Cleaner<number>
export declare const asString: Cleaner<string>
export declare const asUndefined: Cleaner<undefined>
export declare const asUnknown: Cleaner<unknown>

export declare function asValue<
  T extends Array<boolean | number | string | null | undefined>
>(...values: T): Cleaner<T[number]>

// data structures -----------------------------------------------------------

/**
 * Makes a cleaner that accepts an array with the given item type.
 */
export declare function asArray<T>(cleaner: Cleaner<T>): Cleaner<T[]>

/**
 * Makes a cleaner that accepts an object.
 *
 * If asObject receives a single cleaner function,
 * it will will use that to clean all the object's own enumerable properties
 * (except "__proto__", which gets filtered out).
 *
 * Otherwise, if asObject receives an object with cleaners as properties,
 * it will apply each cleaner to the matching key in the object.
 */
export declare function asObject<T>(
  cleaner: Cleaner<T>
): Cleaner<{ [keys: string]: T }>
export declare function asObject<T extends object>(
  shape: CleanerShape<T>
): ObjectCleaner<T>

/**
 * Makes a cleaner that accepts a tuple.
 */
export declare function asTuple<T extends unknown[]>(
  ...shape: CleanerShape<T>
): Cleaner<T>

// branching -----------------------------------------------------------------

/**
 * Makes a cleaner that accepts either of the given types.
 */
export declare function asEither<T extends unknown[]>(
  ...shape: CleanerShape<T>
): Cleaner<T[number]>

/**
 * Wraps a cleaner with an error handling,
 * returning a fallback value (or `undefined`) if the cleaner throws.
 */
export declare function asMaybe<T>(cleaner: Cleaner<T>): Cleaner<T | undefined>
export declare function asMaybe<T>(cleaner: Cleaner<T>, fallback: T): Cleaner<T>

/**
 * Unpacks a value that may be void or null,
 * returning a fallback value (or `undefined`) if missing.
 */
export declare function asOptional<T>(
  cleaner: Cleaner<T>
): Cleaner<T | undefined>
export declare function asOptional<T>(
  cleaner: Cleaner<T>,
  fallback: T
): Cleaner<T>

// parsing -------------------------------------------------------------------

/**
 * Creates a cleaner that can undo its own data conversions.
 */
declare function asCodec<T>(
  cleaner: Cleaner<T>,
  uncleaner: Uncleaner<T>
): Cleaner<T>

/**
 * Parses a string into a JavaScript Date object.
 */
export declare const asDate: Cleaner<Date>

/**
 * Parses a string as JSON, and then cleans the contents.
 */
export declare function asJSON<T>(cleaner: Cleaner<T>): Cleaner<T>

/**
 * Gets the uncleaner that undoes a cleaner's data conversions.
 */
export declare function uncleaner<T>(cleaner: Cleaner<T>): Uncleaner<T>

// deprecated ----------------------------------------------------------------

/**
 * Deprecated. Use `asObject` directly.
 */
export declare const asMap: typeof asObject
