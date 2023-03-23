export function asCodec(cleaner, uncleaner) {
  return function asCodec(raw) {
    return global[uncleaning] > 0 ? uncleaner(raw) : cleaner(raw)
  }
}

export function uncleaner(cleaner) {
  return function uncleaner(raw) {
    // We need to set a flag to indicate that we are un-cleaning.
    // The flag needs to be in a global location,
    // since multiple cleaner implementations should agree
    // which mode we are in.
    if (global[uncleaning] == null) {
      Object.defineProperty(global, uncleaning, {
        value: 0,
        writable: true
      })
    }
    try {
      ++global[uncleaning]
      return cleaner(raw)
    } finally {
      --global[uncleaning]
    }
  }
}

// If we cannot find the standardized "globalThis" object,
// fall back on using the "JSON" constructor, which is also well-known.
const global =
  typeof globalThis === 'object' && globalThis != null ? globalThis : JSON

/* istanbul ignore next */
const uncleaning =
  typeof Symbol === 'function' ? Symbol.for('uncleaning') : 'uncleaning'
