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

    try {
      var out = []
      for (var i = 0; i < raw.length; ++i) {
        out[i] = cleaner(raw[i])
      }
      return out
    } catch (error) {
      throw locateError(error, '*[' + i + ']')
    }
  }
}

/**
 * Makes a cleaner that accepts an object with arbitrary keys
 * and the given value type. Removes keys named `__proto__` for safety.
 */
export function asMap(cleaner) {
  return function asMap(raw) {
    if (raw == null || typeof raw !== 'object') {
      throw new TypeError('Expected an object')
    }

    var keys = Object.keys(raw)
    try {
      var out = {}
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i]
        if (key === '__proto__') continue
        out[key] = cleaner(raw[key])
      }
      return out
    } catch (error) {
      throw locateError(error, '*[' + JSON.stringify(key) + ']')
    }
  }
}

/**
 * Makes a cleaner that accepts an object with the given property types.
 */
export function asObject(cleaner) {
  var keys = Object.keys(cleaner)

  return function asObject(raw) {
    if (raw == null || typeof raw !== 'object') {
      throw new TypeError('Expected an object')
    }

    try {
      var out = {}
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i]
        out[key] = cleaner[key](raw[key])
      }
      return out
    } catch (error) {
      throw locateError(error, '*.' + key)
    }
  }
}

/**
 * Unpacks a value that may be void or null,
 * returning a fallback value if missing.
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

// helpers ---------------------------------------------------------------------

function locateError(error, step) {
  if (error instanceof Error) {
    if (typeof error.addStep !== 'function') {
      var message = error.message
      var steps = '*'
      error.addStep = function (step) {
        steps = steps.replace('*', step)
        error.message = message + ' at ' + steps.replace('*', '')
      }
    }
    error.addStep(step)
  }
  return error
}
