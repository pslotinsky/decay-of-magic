import type { EvalContext } from '../context';
import { UnaryExpression } from './UnaryExpression';

/** The number of entities in its collection operand. */
export class CountExpression extends UnaryExpression {
  public static readonly operator = 'count';
  public static readonly build = UnaryExpression.parse(CountExpression);

  public evaluate(ctx: EvalContext): number {
    return this.toList(this.operand.evaluate(ctx)).length;
  }
}
