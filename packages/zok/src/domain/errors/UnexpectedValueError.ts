const DEFAULT_MESSAGE = 'Unexpected value';

export class UnexpectedValueError extends Error {
  public readonly value: unknown;

  constructor(value: unknown, message: string = DEFAULT_MESSAGE) {
    super(`${message}: ${JSON.stringify(value)}`);
    this.name = this.constructor.name;
    this.value = this.value;
  }
}
