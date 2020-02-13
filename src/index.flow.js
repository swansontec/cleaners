// @flow

/**
 * Reads & checks an untrusted value. Throws an exception if it's wrong.
 */
export type Unpacker<T> = (raw: any) => T

// simple types --------------------------------------------------------------

export const asBoolean: Unpacker<boolean> = raw => raw
export const asNumber: Unpacker<number> = raw => raw
export const asString: Unpacker<string> = raw => raw
export const asNone: Unpacker<void> = raw => raw
export const asNull: Unpacker<null> = raw => raw
export const asUndefined: Unpacker<void> = raw => raw
export const asDate: Unpacker<Date> = raw => raw

// nested types ----------------------------------------------------------------

type ExtractReturnType = <V>(() => V) => V

/**
 * Makes a unpacker that accepts an array with the given item type.
 */
export function asArray<U: Function>(
  unpacker: U
): Unpacker<$Call<ExtractReturnType, U>[]> {
  return raw => raw
}

/**
 * Makes a unpacker that accepts an object with the given property types.
 */
export function asObject<U: { [key: string]: Function }>(
  unpacker: U
): Unpacker<$ObjMap<U, ExtractReturnType>> {
  return raw => raw
}

/**
 * Makes a unpacker that accepts either of the given types.
 */
export function asEither<A: Function, B: Function>(
  a: A,
  b: B
): Unpacker<$Call<ExtractReturnType, A> | $Call<ExtractReturnType, B>> {
  return raw => raw
}

/**
 * Unpacks a value that may be void or null,
 * returning a fallback value if missing.
 */
export function asOptional<U: Function, F>(
  unpacker: U,
  fallback: F
): Unpacker<$Call<ExtractReturnType, U> | F> {
  return raw => raw
}
