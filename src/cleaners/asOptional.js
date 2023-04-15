export function asOptional(cleaner, fallback) {
  return function asOptional(raw) {
    return raw != null
      ? cleaner(raw)
      : typeof fallback === 'function'
      ? fallback()
      : fallback
  }
}
