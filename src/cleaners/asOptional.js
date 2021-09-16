export function asOptional(cleaner, fallback) {
  return function asOptional(raw) {
    return raw != null ? cleaner(raw) : fallback
  }
}
