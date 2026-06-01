import { ComparisonExpression } from './ComparisonExpression';

/** True when the left operand is greater than or equal to the right. */
export class GteExpression extends ComparisonExpression {
  public static readonly operator = 'gte';
  public static readonly build = ComparisonExpression.parse(GteExpression);

  protected compare(left: number, right: number): boolean {
    return left >= right;
  }
}
