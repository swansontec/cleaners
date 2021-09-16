export function asValue(...values) {
  return function asValue(raw) {
    for (let i = 0; i < values.length; ++i) {
      if (raw === values[i]) return raw
    }

    // Create a fancy error message:
    let message = 'Expected '
    if (values.length !== 1) message += 'one of: '
    for (let i = 0; i < values.length; ++i) {
      if (i > 0) message += ' | '
      message += JSON.stringify(values[i])
    }
    throw new TypeError(message)
  }
}
