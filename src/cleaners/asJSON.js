import { locateError } from '../locateError'
import { asCodec } from './asCodec'
import { asString } from './primitives'

export function asJSON(cleaner) {
  return asCodec(
    function asJSON(raw) {
      const value = JSON.parse(asString(raw))
      try {
        return cleaner(value)
      } catch (error) {
        throw locateError(error, 'JSON.parse()', 11)
      }
    },
    function wasJSON(clean) {
      return JSON.stringify(cleaner(clean))
    }
  )
}
