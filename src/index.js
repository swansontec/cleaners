// simple types --------------------------------------------------------------

export function asBoolean(raw) {
  if (typeof raw !== 'boolean') throw new TypeError('Expected a boolean')
  return raw
}

export const asNull = asValue(null)

export function asNumber(raw) {
  if (typeof raw !== 'number') throw new TypeError('Expected a number')
  return raw
}

export function asString(raw) {
  if (typeof raw !== 'string') throw new TypeError('Expected a string')
  return raw
}

export const asUndefined = asValue(undefined)

export const asNone = asOptional(asNull)

export function asUnknown(raw) {
  return raw
}

// data structures -----------------------------------------------------------

export function asArray(cleaner) {
  return function asArray(raw) {
    if (!Array.isArray(raw)) {
      throw new TypeError('Expected an array')
    }

    const out = []
    for (let i = 0; i < raw.length; ++i) {
      try {
        out[i] = cleaner(raw[i])
      } catch (error) {
        throw locateError(error, '[' + i + ']', 0)
      }
    }
    return out
  }
}

export function asObject(shape) {
  // The key-value version:
  if (typeof shape === 'function') {
    return function asObject(raw) {
      if (typeof raw !== 'object' || raw == null) {
        throw new TypeError('Expected an object')
      }

      const out = {}
      const keys = Object.keys(raw)
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i]
        if (key === '__proto__') continue
        try {
          out[key] = shape(raw[key])
        } catch (error) {
          throw locateError(error, '[' + JSON.stringify(key) + ']', 0)
        }
      }
      return out
    }
  }

  // The shape-aware version:
  const keys = Object.keys(shape)
  function bindObjectShape(keepRest) {
    return function asObject(raw) {
      if (typeof raw !== 'object' || raw == null) {
        throw new TypeError('Expected an object')
      }

      let i
      const out = {}
      if (keepRest) {
        const toCopy = Object.keys(raw)
        for (i = 0; i < toCopy.length; ++i) {
          const key = toCopy[i]
          if (key === '__proto__') continue
          out[key] = raw[key]
        }
      }
      for (i = 0; i < keys.length; ++i) {
        const key = keys[i]
        try {
          out[key] = shape[key](raw[key])
        } catch (error) {
          throw locateError(error, '.' + key, 0)
        }
      }
      return out
    }
  }
  const out = bindObjectShape(false)
  out.shape = shape
  out.withRest = bindObjectShape(true)
  return out
}

// branching -----------------------------------------------------------------

export function asEither(...shape) {
  return function asEither(raw) {
    for (let i = 0; i < shape.length; i++) {
      try {
        return shape[i](raw)
      } catch (error) {
        if (i + 1 >= shape.length) throw error
      }
    }
  }
}

export function asMaybe(cleaner, fallback) {
  return function asMaybe(raw) {
    try {
      return cleaner(raw)
    } catch (e) {
      return fallback
    }
  }
}

export function asOptional(cleaner, fallback) {
  return function asOptional(raw) {
    return raw != null ? cleaner(raw) : fallback
  }
}

// parsing -------------------------------------------------------------------

let uncleaning = 0

export function asCodec(cleaner, uncleaner) {
  return function asCodec(raw) {
    return uncleaning > 0 ? uncleaner(raw) : cleaner(raw)
  }
}

export const asDate = asCodec(
  function asDate(raw) {
    if (typeof raw !== 'string' && !(raw instanceof Date)) {
      throw new TypeError('Expected a date string')
    }

    const out = new Date(raw)
    if (out.toJSON() == null) throw new TypeError('Invalid date format')
    return out
  },
  function wasDate(clean) {
    return clean.toISOString()
  }
)

export function asJSON(cleaner) {
  return asCodec(
    function asJSON(raw) {
      const value = JSON.parse(asString(raw))
      try {
        return cleaner(value)
      } catch (error) {
        throw locateError(error, 'JSON.parse()', 11)
      }
    },
    function wasJSON(clean) {
      return JSON.stringify(cleaner(clean))
    }
  )
}

export function uncleaner(cleaner) {
  return function uncleaner(raw) {
    try {
      ++uncleaning
      return cleaner(raw)
    } finally {
      --uncleaning
    }
  }
}

export function asValue(value) {
  return function asValue(raw) {
    if (raw !== value) {
      throw new TypeError(`Expected ${JSON.stringify(value)}`)
    }
    return raw
  }
}

// deprecated ----------------------------------------------------------------

export const asMap = asObject

// helpers -------------------------------------------------------------------

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
