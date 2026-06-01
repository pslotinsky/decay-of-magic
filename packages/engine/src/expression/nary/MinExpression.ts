import { NaryNumericExpression } from './NaryNumericExpression';

/** Smallest of its operands. */
export class MinExpression extends NaryNumericExpression {
  public static readonly operator = 'min';
  public static readonly build = NaryNumericExpression.parse(MinExpression);

  protected combine(values: number[]): number {
    return Math.min(...values);
  }
}
