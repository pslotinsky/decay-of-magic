import type { EvalContext } from '../context';
import { BinaryExpression } from './BinaryExpression';

/** Left operand minus the right. */
export class SubExpression extends BinaryExpression {
  public static readonly operator = 'sub';
  public static readonly build = BinaryExpression.parse(SubExpression);

  public evaluate(ctx: EvalContext): number {
    return this.left.evaluateNumber(ctx) - this.right.evaluateNumber(ctx);
  }
}
