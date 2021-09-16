import { locateError } from '../locateError.js'

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
