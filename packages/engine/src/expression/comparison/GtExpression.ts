import { ComparisonExpression } from './ComparisonExpression';

/** True when the left operand is greater than the right. */
export class GtExpression extends ComparisonExpression {
  public static readonly operator = 'gt';
  public static readonly build = ComparisonExpression.parse(GtExpression);

  protected compare(left: number, right: number): boolean {
    return left > right;
  }
}
