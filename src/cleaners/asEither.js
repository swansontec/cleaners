export function asEither(...shape) {
  return function asEither(raw) {
    for (let i = 0; i < shape.length; i++) {
      try {
        return shape[i](raw)
      } catch (error) {
        if (i + 1 >= shape.length) throw error
      }
    }
  }
}
