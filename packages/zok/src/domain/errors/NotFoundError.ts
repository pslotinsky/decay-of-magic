export class NotFoundError<
  T,
  C extends Record<string, unknown> = Record<string, unknown>,
> extends Error {
  public readonly entity: string;
  public readonly criteria: C;

  constructor(entity: string, criteria: C) {
    super(`${entity} not found with criteria: ${JSON.stringify(criteria)}`);

    this.name = this.constructor.name;
    this.entity = entity;
    this.criteria = criteria;
  }
}
