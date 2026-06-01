import { BinaryExpression } from '../binary/BinaryExpression';
import type { EvalContext } from '../context';

/** Base for two-operand numeric comparisons. */
export abstract class ComparisonExpression extends BinaryExpression {
  public evaluate(ctx: EvalContext): boolean {
    return this.compare(
      this.left.evaluateNumber(ctx),
      this.right.evaluateNumber(ctx),
    );
  }

  protected abstract compare(left: number, right: number): boolean;
}
