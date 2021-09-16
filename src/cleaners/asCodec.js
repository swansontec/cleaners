let uncleaning = 0

export function asCodec(cleaner, uncleaner) {
  return function asCodec(raw) {
    return uncleaning > 0 ? uncleaner(raw) : cleaner(raw)
  }
}

export function uncleaner(cleaner) {
  return function uncleaner(raw) {
    try {
      ++uncleaning
      return cleaner(raw)
    } finally {
      --uncleaning
    }
  }
}
