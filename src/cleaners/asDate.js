import { showValue } from '../showValue.js'
import { asCodec } from './asCodec.js'

export const asDate = asCodec(
  function asDate(raw) {
    if (typeof raw !== 'string' && !(raw instanceof Date)) {
      throw new TypeError('Expected a date string, got ' + showValue(raw))
    }

    const out = new Date(raw)
    if (out.toJSON() == null) {
      throw new TypeError('Invalid date format, got ' + showValue(raw))
    }
    return out
  },
  function wasDate(clean) {
    return clean.toISOString()
  }
)
