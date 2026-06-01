/** Raised when an action is submitted that the rules do not permit. */
export class IllegalActionError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'IllegalActionError';
  }
}
