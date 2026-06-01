import { Expression, type ExpressionParser } from '../Expression';
import type { ExpressionDefinition } from '../types';

/** Base for operators that take exactly two operands. */
export abstract class BinaryExpression extends Expression {
  public static parse(
    Node: new (left: Expression, right: Expression) => Expression,
  ): (parser: ExpressionParser, argument: unknown) => Expression {
    return (parser, argument) => {
      const [left, right] = argument as [
        ExpressionDefinition,
        ExpressionDefinition,
      ];
      return new Node(parser.from(left), parser.from(right));
    };
  }

  public constructor(
    protected readonly left: Expression,
    protected readonly right: Expression,
  ) {
    super();
  }
}
