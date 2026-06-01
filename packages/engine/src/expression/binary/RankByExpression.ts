import type { EvalContext } from '../context';
import { BinaryExpression } from './BinaryExpression';

/** The 1-based rank of the context target within a collection ordered by a stat, highest first. */
export class RankByExpression extends BinaryExpression {
  public static readonly operator = 'rankBy';
  public static readonly build = BinaryExpression.parse(RankByExpression);

  public evaluate(ctx: EvalContext): number {
    if (ctx.target === undefined) {
      throw new Error('rankBy requires a target candidate in context');
    }

    const stat = this.right.evaluateString(ctx);
    const ranked = this.toList(this.left.evaluate(ctx))
      .slice()
      .sort(
        (left, right) => this.statOf(right, stat) - this.statOf(left, stat),
      );

    return ranked.indexOf(ctx.target) + 1;
  }
}
