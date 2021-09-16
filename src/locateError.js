/**
 * Adds location information to an error message.
 *
 * Errors can occur inside deeply-nested cleaners,
 * such as "TypeError: Expected a string at .array[0].some.property".
 * To build this information, each cleaner along the path
 * should add its own location information as the stack unwinds.
 *
 * If the error has a `insertStepAt` property, that is the character offset
 * where the next step will go in the error message. Otherwise,
 * the next step just goes on the end of the string with the word "at".
 */
export function locateError(error, step, offset) {
  if (error instanceof Error) {
    if (error.insertStepAt == null) {
      error.message += ' at '
      error.insertStepAt = error.message.length
    }
    error.message =
      error.message.slice(0, error.insertStepAt) +
      step +
      error.message.slice(error.insertStepAt)
    error.insertStepAt += offset
  }
  return error
}
