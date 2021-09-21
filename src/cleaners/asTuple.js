import { locateError } from '../locateError'

export function asTuple(...shape) {
  function asTuple(raw) {
    if (!Array.isArray(raw)) {
      throw new TypeError('Expected an array')
    }

    const out = []
    for (let i = 0; i < shape.length; ++i) {
      try {
        out[i] = shape[i](raw[i])
      } catch (error) {
        throw locateError(error, `[${i}]`)
      }
    }
    return out
  }
  return asTuple
}
