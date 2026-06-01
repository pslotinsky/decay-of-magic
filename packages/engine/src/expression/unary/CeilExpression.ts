import type { EvalContext } from '../context';
import { UnaryExpression } from './UnaryExpression';

/** Rounds its numeric operand up to the nearest integer. */
export class CeilExpression extends UnaryExpression {
  public static readonly operator = 'ceil';
  public static readonly build = UnaryExpression.parse(CeilExpression);

  public evaluate(ctx: EvalContext): number {
    return Math.ceil(this.operand.evaluateNumber(ctx));
  }
}
