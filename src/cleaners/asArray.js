import { locateError } from '../locateError.js'
import { showValue } from '../showValue.js'

export function asArray(cleaner) {
  return function asArray(raw) {
    if (!Array.isArray(raw)) {
      throw new TypeError('Expected an array, got ' + showValue(raw))
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
