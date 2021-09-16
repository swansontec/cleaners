export function asMaybe(cleaner, fallback) {
  return function asMaybe(raw) {
    try {
      return cleaner(raw)
    } catch (e) {
      return fallback
    }
  }
}
