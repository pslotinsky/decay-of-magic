import type { EvalContext } from '../context';
import { BinaryExpression } from './BinaryExpression';

/** The highest value of a stat across a collection, or 0 when empty. */
export class MaxByExpression extends BinaryExpression {
  public static readonly operator = 'maxBy';
  public static readonly build = BinaryExpression.parse(MaxByExpression);

  public evaluate(ctx: EvalContext): number {
    const stat = this.right.evaluateString(ctx);
    const values = this.toList(this.left.evaluate(ctx)).map((entity) =>
      this.statOf(entity, stat),
    );

    return values.length > 0 ? Math.max(...values) : 0;
  }
}
