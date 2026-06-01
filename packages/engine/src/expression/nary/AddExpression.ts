import { NaryNumericExpression } from './NaryNumericExpression';

/** Sum of its operands. */
export class AddExpression extends NaryNumericExpression {
  public static readonly operator = 'add';
  public static readonly build = NaryNumericExpression.parse(AddExpression);

  protected combine(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0);
  }
}
