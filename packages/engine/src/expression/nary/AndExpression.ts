import type { EvalContext } from '../context';
import { NaryExpression } from './NaryExpression';

/** True when every operand is truthy. */
export class AndExpression extends NaryExpression {
  public static readonly operator = 'and';
  public static readonly build = NaryExpression.parse(AndExpression);

  public evaluate(ctx: EvalContext): boolean {
    return this.operands.every((operand) =>
      this.toBoolean(operand.evaluate(ctx)),
    );
  }
}
