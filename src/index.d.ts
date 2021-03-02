/**
 * Reads & checks an untrusted value. Throws an exception if it's wrong.
 */
export declare type Cleaner<T> = (raw: any) => T

declare type ObjectShape<T> = {
  [K in keyof T]: Cleaner<T[K]>
}

/**
 * A cleaner, but with an extra `shape` property:
 */
export declare interface ObjectCleaner<T> extends Cleaner<T> {
  readonly shape: ObjectShape<T>
  readonly withRest: Cleaner<T>
}

// simple types --------------------------------------------------------------

export declare const asBoolean: Cleaner<boolean>
export declare const asDate: Cleaner<Date>
export declare const asNone: Cleaner<undefined>
export declare const asNull: Cleaner<null>
export declare const asNumber: Cleaner<number>
export declare const asString: Cleaner<string>
export declare const asUndefined: Cleaner<undefined>
export declare const asUnknown: Cleaner<unknown>

// nested types ----------------------------------------------------------------

/**
 * Makes a cleaner that accepts an array with the given item type.
 */
export declare function asArray<T>(cleaner: Cleaner<T>): Cleaner<T[]>

/**
 * Makes a cleaner that accepts an object.
 */
export declare function asObject<T>(
  cleaner: Cleaner<T>
): Cleaner<{ [keys: string]: T }>
export declare function asObject<T extends object>(
  shape: ObjectShape<T>
): ObjectCleaner<T>

/**
 * Deprecated. Use `asObject` directly.
 */
export declare const asMap: typeof asObject

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

/**
 * Makes a cleaner that accepts either of the given types.
 */
export declare function asEither<A, B>(
  a: Cleaner<A>,
  b: Cleaner<B>
): Cleaner<A | B>

/**
 * Wraps a cleaner with an error handling,
 * returning a fallback value (or `undefined`) if the cleaner throws.
 */
export declare function asMaybe<T>(cleaner: Cleaner<T>): Cleaner<T | undefined>
export declare function asMaybe<T>(cleaner: Cleaner<T>, fallback: T): Cleaner<T>

/**
 * Makes a cleaner that parses & validates JSON strings.
 */
export declare function asJSON<T>(cleaner: Cleaner<T>): Cleaner<T>
