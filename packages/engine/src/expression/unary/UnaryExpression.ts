import { Expression, type ExpressionParser } from '../Expression';
import type { ExpressionDefinition } from '../types';

/** Base for operators that take a single operand. */
export abstract class UnaryExpression extends Expression {
  public static parse(
    Node: new (operand: Expression) => Expression,
  ): (parser: ExpressionParser, argument: unknown) => Expression {
    return (parser, argument) =>
      new Node(parser.from(argument as ExpressionDefinition));
  }

  public constructor(protected readonly operand: Expression) {
    super();
  }
}
