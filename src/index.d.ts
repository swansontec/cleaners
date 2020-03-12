/**
 * Reads & checks an untrusted value. Throws an exception if it's wrong.
 */
export declare type Cleaner<T> = (raw: any) => T

// simple types --------------------------------------------------------------

export declare const asBoolean: Cleaner<boolean>
export declare const asNull: Cleaner<null>
export declare const asNumber: Cleaner<number>
export declare const asString: Cleaner<string>
export declare const asUndefined: Cleaner<undefined>
export declare const asNone: Cleaner<undefined>
export declare const asDate: Cleaner<Date>

// nested types ----------------------------------------------------------------

declare type ObjectJsonCleaner<O> = {
  [T in keyof O]: Cleaner<O[T]>
}

/**
 * Makes a cleaner that accepts an array with the given item type.
 */
export declare function asArray<T>(cleaner: Cleaner<T>): Cleaner<T[]>

/**
 * Makes a cleaner that accepts an object with arbitrary keys
 * and the given value type. Removes keys named `__proto__` for safety.
 */
export declare function asMap<T>(
  cleaner: Cleaner<T>
): Cleaner<{ [key: string]: T }>

/**
 * Makes a cleaner that accepts an object with the given property types.
 */
export declare function asObject<O>(cleaner: ObjectJsonCleaner<O>): Cleaner<O>

/**
 * Unpacks a value that may be void or null,
 * returning a fallback value if missing.
 */
export declare function asOptional<T>(
  cleaner: Cleaner<T>
): Cleaner<T | undefined>

export declare function asOptional<T, F>(
  cleaner: Cleaner<T>,
  fallback: F
): Cleaner<T | F>

/**
 * Makes a cleaner that accepts either of the given types.
 */
export declare function asEither<A, B>(
  a: Cleaner<A>,
  b: Cleaner<B>
): Cleaner<A | B>