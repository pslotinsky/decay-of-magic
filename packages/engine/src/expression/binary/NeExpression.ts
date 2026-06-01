import type { EvalContext } from '../context';
import { BinaryExpression } from './BinaryExpression';

/** True when the operands evaluate unequal. */
export class NeExpression extends BinaryExpression {
  public static readonly operator = 'ne';
  public static readonly build = BinaryExpression.parse(NeExpression);

  public evaluate(ctx: EvalContext): boolean {
    return this.left.evaluate(ctx) !== this.right.evaluate(ctx);
  }
}
