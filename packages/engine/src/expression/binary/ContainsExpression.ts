import type { EvalContext } from '../context';
import { BinaryExpression } from './BinaryExpression';

/** True when the left list contains the right value. */
export class ContainsExpression extends BinaryExpression {
  public static readonly operator = 'contains';
  public static readonly build = BinaryExpression.parse(ContainsExpression);

  public evaluate(ctx: EvalContext): boolean {
    const list = this.toStrings(this.left.evaluate(ctx));

    return list.includes(this.right.evaluateString(ctx));
  }
}
