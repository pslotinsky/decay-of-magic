import { ComparisonExpression } from './ComparisonExpression';

/** True when the left operand is less than or equal to the right. */
export class LteExpression extends ComparisonExpression {
  public static readonly operator = 'lte';
  public static readonly build = ComparisonExpression.parse(LteExpression);

  protected compare(left: number, right: number): boolean {
    return left <= right;
  }
}
