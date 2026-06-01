import { Expression } from '../Expression';
import type { Value } from '../types';

/** A constant number or boolean. */
export class LiteralExpression extends Expression {
  public constructor(private readonly value: number | boolean) {
    super();
  }

  public evaluate(): Value {
    return this.value;
  }
}
