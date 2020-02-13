/**
 * Reads & checks an untrusted value. Throws an exception if it's wrong.
 */
export type Cleaner<T> = (raw: any) => T

// simple types --------------------------------------------------------------

export const asBoolean: Cleaner<boolean> = raw => {
  if (typeof raw !== 'boolean') throw new TypeError('Expected a boolean')
  return raw
}

export const asNull: Cleaner<null> = raw => {
  if (raw !== null) throw new TypeError('Expected null')
  return null
}

export const asNumber: Cleaner<number> = raw => {
  if (typeof raw !== 'number') throw new TypeError('Expected a number')
  return raw
}

export const asString: Cleaner<string> = raw => {
  if (typeof raw !== 'string') throw new TypeError('Expected a string')
  return raw
}

export const asUndefined: Cleaner<undefined> = raw => {
  if (raw !== undefined) throw new TypeError('Unexpected value')
  return undefined
}

export const asNone: Cleaner<undefined> = raw => {
  if (raw != null) throw new TypeError('Unexpected value')
  return undefined
}

export const asDate: Cleaner<Date> = raw => {
  if (typeof raw !== 'string' && !(raw instanceof Date)) {
    throw new TypeError('Expected a date string')
  }
  const out = new Date(raw)
  if (out.toJSON() == null) throw new TypeError('Invalid date format')
  return out
}

// nested types ----------------------------------------------------------------

/**
 * Makes a cleaner that accepts an array with the given item type.
 */
export function asArray<T>(cleaner: Cleaner<T>): Cleaner<T[]> {
  return raw => {
    if (!Array.isArray(raw)) throw new TypeError('Expected an array')

    const out: T[] = []
    for (let i = 0; i < raw.length; ++i) out[i] = cleaner(raw[i])
    return out
  }
}

type ObjectJsonCleaner<O> = {
  [T in keyof O]: Cleaner<O[T]>
}

/**
 * Makes a cleaner that accepts an object with the given property types.
 */
export function asObject<O>(cleaner: ObjectJsonCleaner<O>): Cleaner<O> {
  return raw => {
    if (raw == null || typeof raw !== 'object') {
      throw new TypeError('Expected an object')
    }

    const out: O = {} as any
    for (const k in cleaner) out[k] = cleaner[k](raw[k])
    return out
  }
}

/**
 * Unpacks a value that may be void or null,
 * returning a fallback value if missing.
 */
export function asOptional<T, F = undefined>(
  cleaner: Cleaner<T>,
  fallback?: F
): Cleaner<T | F> {
  return raw => (raw != null ? cleaner(raw) : (fallback as F))
}

/**
 * Makes a cleaner that accepts either of the given types.
 */
export function asEither<A, B>(a: Cleaner<A>, b: Cleaner<B>): Cleaner<A | B> {
  return raw => {
    try {
      return a(raw)
    } catch (e) {
      return b(raw)
    }
  }
}
