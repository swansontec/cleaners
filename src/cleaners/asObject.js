import { locateError } from '../locateError'

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

// Deprecated:
export const asMap = asObject
