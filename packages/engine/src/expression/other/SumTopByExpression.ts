import type { EvalContext } from '../context';
import { Expression, type ExpressionParser } from '../Expression';
import type { ExpressionDefinition } from '../types';

/** Sums a stat across the top N entities of a collection, ranked by that stat. */
export class SumTopByExpression extends Expression {
  public static readonly operator = 'sumTopBy';

  public static build(
    parser: ExpressionParser,
    argument: unknown,
  ): SumTopByExpression {
    const [collection, count, stat] = argument as [
      ExpressionDefinition,
      ExpressionDefinition,
      ExpressionDefinition,
    ];

    return new SumTopByExpression(
      parser.from(collection),
      parser.from(count),
      parser.from(stat),
    );
  }

  public constructor(
    private readonly collection: Expression,
    private readonly count: Expression,
    private readonly stat: Expression,
  ) {
    super();
  }

  public evaluate(ctx: EvalContext): number {
    const count = this.count.evaluateNumber(ctx);
    const stat = this.stat.evaluateString(ctx);

    return this.toList(this.collection.evaluate(ctx))
      .map((entity) => this.statOf(entity, stat))
      .sort((left, right) => right - left)
      .slice(0, count)
      .reduce((sum, value) => sum + value, 0);
  }
}
