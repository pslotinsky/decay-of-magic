import type { EvalContext } from '../context';
import { NaryExpression } from './NaryExpression';

/** Base for variadic operators that fold their operands into a single number. */
export abstract class NaryNumericExpression extends NaryExpression {
  public evaluate(ctx: EvalContext): number {
    return this.combine(
      this.operands.map((operand) => operand.evaluateNumber(ctx)),
    );
  }

  protected abstract combine(values: number[]): number;
}
