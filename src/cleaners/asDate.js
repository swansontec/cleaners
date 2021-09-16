import { asCodec } from './asCodec.js'

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
