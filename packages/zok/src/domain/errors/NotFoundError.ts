export class NotFoundError<
  T,
  C extends Record<string, unknown> = Record<string, unknown>,
> extends Error {
  public readonly entity: string;
  public readonly criteria: C;

  constructor(entityClass: new (...args: any[]) => T, criteria: C) {
    super(
      `${entityClass.name} not found with criteria: ${JSON.stringify(
        criteria,
      )}`,
    );
    this.name = this.constructor.name;
    this.entity = entityClass.name;
    this.criteria = criteria;
  }
}
