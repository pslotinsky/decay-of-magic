import type { EvalContext } from '../context';
import { Expression } from '../Expression';
import type { Value } from '../types';

/** Reads a value from the battle by dotted path (such as enemyHero.stats.health), resolved from the evaluating combatant's perspective. */
export class PathExpression extends Expression {
  public constructor(private readonly path: string) {
    super();
  }

  public evaluate(ctx: EvalContext): Value {
    return ctx.resolve(this.path);
  }
}
