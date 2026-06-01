import { NaryNumericExpression } from './NaryNumericExpression';

/** Product of its operands. */
export class MulExpression extends NaryNumericExpression {
  public static readonly operator = 'mul';
  public static readonly build = NaryNumericExpression.parse(MulExpression);

  protected combine(values: number[]): number {
    return values.reduce((product, value) => product * value, 1);
  }
}
