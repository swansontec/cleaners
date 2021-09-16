import { asOptional } from './asOptional.js'
import { asValue } from './asValue.js'

export function asBoolean(raw) {
  if (typeof raw !== 'boolean') throw new TypeError('Expected a boolean')
  return raw
}

export function asNumber(raw) {
  if (typeof raw !== 'number') throw new TypeError('Expected a number')
  return raw
}

export function asString(raw) {
  if (typeof raw !== 'string') throw new TypeError('Expected a string')
  return raw
}

export const asNull = asValue(null)
export const asUndefined = asValue(undefined)

export function asUnknown(raw) {
  return raw
}

// Deprecated:
export const asNone = asOptional(asNull)
