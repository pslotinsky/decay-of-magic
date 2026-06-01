import type { EvalContext } from '../context';
import { UnaryExpression } from './UnaryExpression';

/** Logical negation of its boolean operand. */
export class NotExpression extends UnaryExpression {
  public static readonly operator = 'not';
  public static readonly build = UnaryExpression.parse(NotExpression);

  public evaluate(ctx: EvalContext): boolean {
    return !this.toBoolean(this.operand.evaluate(ctx));
  }
}
