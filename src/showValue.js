/**
 * Given a JS value, produce a descriptive string.
 */
export function showValue(value) {
  switch (typeof value) {
    case 'function':
    case 'object':
      if (value == null) return 'null'
      if (Array.isArray(value)) return 'array'
      return typeof value

    case 'string':
      return JSON.stringify(value)

    default:
      return String(value)
  }
}
