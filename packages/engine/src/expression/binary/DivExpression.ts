import type { EvalContext } from '../context';
import { BinaryExpression } from './BinaryExpression';

/** Left operand divided by the right. */
export class DivExpression extends BinaryExpression {
  public static readonly operator = 'div';
  public static readonly build = BinaryExpression.parse(DivExpression);

  public evaluate(ctx: EvalContext): number {
    return this.left.evaluateNumber(ctx) / this.right.evaluateNumber(ctx);
  }
}
