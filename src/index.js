/* eslint-disable no-var */

'use strict'

// simple types --------------------------------------------------------------

export function asBoolean(raw) {
  if (typeof raw !== 'boolean') throw new TypeError('Expected a boolean')
  return raw
}

export function asNull(raw) {
  if (raw !== null) throw new TypeError('Expected null')
  return null
}

export function asNumber(raw) {
  if (typeof raw !== 'number') throw new TypeError('Expected a number')
  return raw
}

export function asString(raw) {
  if (typeof raw !== 'string') throw new TypeError('Expected a string')
  return raw
}

export function asUndefined(raw) {
  if (raw !== undefined) throw new TypeError('Unexpected value')
  return undefined
}

export function asNone(raw) {
  if (raw != null) throw new TypeError('Unexpected value')
  return undefined
}

export function asDate(raw) {
  if (typeof raw !== 'string' && !(raw instanceof Date)) {
    throw new TypeError('Expected a date string')
  }

  var out = new Date(raw)
  if (out.toJSON() == null) throw new TypeError('Invalid date format')
  return out
}

export function asUnknown(raw) {
  return raw
}

// nested types ----------------------------------------------------------------

/**
 * Makes a cleaner that accepts an array with the given item type.
 */
export function asArray(cleaner) {
  return function asArray(raw) {
    if (!Array.isArray(raw)) {
      throw new TypeError('Expected an array')
    }

    var out = []
    try {
      for (var i = 0; i < raw.length; ++i) {
        out[i] = cleaner(raw[i])
      }
    } catch (error) {
      throw locateError(error, '[' + i + ']', 0)
    }
    return out
  }
}

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
export function asObject(shape) {
  // The key-value version:
  if (typeof shape === 'function') {
    return function asObject(raw) {
      if (typeof raw !== 'object' || raw == null) {
        throw new TypeError('Expected an object')
      }

      var out = {}
      var keys = Object.keys(raw)
      try {
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i]
          if (key === '__proto__') continue
          out[key] = shape(raw[key])
        }
      } catch (error) {
        throw locateError(error, '[' + JSON.stringify(key) + ']', 0)
      }
      return out
    }
  }

  // The shape-aware version:
  var keys = Object.keys(shape)
  function copyObjectShape(raw, out) {
    try {
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i]
        out[key] = shape[key](raw[key])
      }
    } catch (error) {
      throw locateError(error, '.' + key, 0)
    }
    return out
  }

  // Build the object cleaner:
  function asObject(raw) {
    if (typeof raw !== 'object' || raw == null) {
      throw new TypeError('Expected an object')
    }

    return copyObjectShape(raw, {})
  }
  asObject.shape = shape
  asObject.withRest = function withRest(raw) {
    if (typeof raw !== 'object' || raw == null) {
      throw new TypeError('Expected an object')
    }

    var out = {}
    var keys = Object.keys(raw)
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
      if (key === '__proto__') continue
      out[key] = raw[key]
    }
    return copyObjectShape(raw, out)
  }
  return asObject
}

/**
 * Deprecated. Use `asObject` directly.
 */
export var asMap = asObject

export function asJSON(cleaner) {
  return function asJSON(raw) {
    var value = JSON.parse(asString(raw))
    try {
      return cleaner(value)
    } catch (error) {
      throw locateError(error, 'JSON.parse()', 11)
    }
  }
}

/**
 * Unpacks a value that may be void or null,
 * returning a fallback value (or `undefined`) if missing.
 */
export function asOptional(cleaner, fallback) {
  return function asOptional(raw) {
    return raw != null ? cleaner(raw) : fallback
  }
}

/**
 * Makes a cleaner that accepts either of the given types.
 */
export function asEither(a, b) {
  return function asEither(raw) {
    try {
      return a(raw)
    } catch (e) {
      return b(raw)
    }
  }
}

/**
 * Unpacks a value that may be void or null,
 * returning a fallback value (or `undefined`) if missing.
 */
export function asMaybe(cleaner, fallback) {
  return function asMaybe(raw) {
    try {
      return cleaner(raw)
    } catch (e) {
      return fallback
    }
  }
}

export function asLiteral(literal) {
  return function asLiteral(raw) {
    if (raw !== literal) {
      throw new TypeError(
        `Expected ${typeof literal} literal '${JSON.stringify(literal)}'`
      )
    }
    return raw
  }
}

// helpers ---------------------------------------------------------------------

/**
 * Adds location information to an error message.
 *
 * Errors can occur inside deeply-nested cleaners,
 * such as "TypeError: Expected a string at .array[0].some.property".
 * To build this information, each cleaner along the path
 * should add its own location information as the stack unwinds.
 *
 * If the error has a `insertStepAt` property, that is the character offset
 * where the next step will go in the error message. Otherwise,
 * the next step just goes on the end of the string with the word "at".
 */
function locateError(error, step, offset) {
  if (error instanceof Error) {
    if (error.insertStepAt == null) {
      error.message += ' at '
      error.insertStepAt = error.message.length
    }
    error.message =
      error.message.slice(0, error.insertStepAt) +
      step +
      error.message.slice(error.insertStepAt)
    error.insertStepAt += offset
  }
  return error
}
