import type { EvalContext } from '../context';
import { NaryExpression } from './NaryExpression';

/** True when any operand is truthy. */
export class OrExpression extends NaryExpression {
  public static readonly operator = 'or';
  public static readonly build = NaryExpression.parse(OrExpression);

  public evaluate(ctx: EvalContext): boolean {
    return this.operands.some((operand) =>
      this.toBoolean(operand.evaluate(ctx)),
    );
  }
}
