type ErrorConstructor = new (...args: never[]) => Error;

// Maps a caught error to a safe, user-facing message for Server Action
// responses. "Known" error types (domain errors whose .message is already
// written to be shown to the user) surface their own message; anything
// else collapses to fallbackMessage so internal error details never leak
// to the client. Centralizes a catch-block shape that was previously
// hand-repeated (with identical structure) across every mutating action.
export function toActionError(
  error: unknown,
  fallbackMessage: string,
  knownErrors: ErrorConstructor[] = [],
): string {
  for (const ErrorType of knownErrors) {
    if (error instanceof ErrorType) {
      return error.message;
    }
  }
  return fallbackMessage;
}
