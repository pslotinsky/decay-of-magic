import type { EvalContext } from '../context';
import { BinaryExpression } from './BinaryExpression';

/** True when both operands evaluate equal. */
export class EqExpression extends BinaryExpression {
  public static readonly operator = 'eq';
  public static readonly build = BinaryExpression.parse(EqExpression);

  public evaluate(ctx: EvalContext): boolean {
    return this.left.evaluate(ctx) === this.right.evaluate(ctx);
  }
}
