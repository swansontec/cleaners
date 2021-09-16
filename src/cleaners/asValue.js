export function asValue(value) {
  return function asValue(raw) {
    if (raw !== value) {
      throw new TypeError(`Expected ${JSON.stringify(value)}`)
    }
    return raw
  }
}
