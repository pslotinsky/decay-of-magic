import { NaryNumericExpression } from './NaryNumericExpression';

/** Largest of its operands. */
export class MaxExpression extends NaryNumericExpression {
  public static readonly operator = 'max';
  public static readonly build = NaryNumericExpression.parse(MaxExpression);

  protected combine(values: number[]): number {
    return Math.max(...values);
  }
}
