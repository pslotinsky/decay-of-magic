import { ComparisonExpression } from './ComparisonExpression';

/** True when the left operand is less than the right. */
export class LtExpression extends ComparisonExpression {
  public static readonly operator = 'lt';
  public static readonly build = ComparisonExpression.parse(LtExpression);

  protected compare(left: number, right: number): boolean {
    return left < right;
  }
}
