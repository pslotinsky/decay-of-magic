import { Expression, type ExpressionParser } from '../Expression';
import type { ExpressionDefinition } from '../types';

/** Base for operators that take a variable number of operands. */
export abstract class NaryExpression extends Expression {
  public static parse(
    Node: new (operands: Expression[]) => Expression,
  ): (parser: ExpressionParser, argument: unknown) => Expression {
    return (parser, argument) =>
      new Node(
        (argument as ExpressionDefinition[]).map((item) => parser.from(item)),
      );
  }

  public constructor(protected readonly operands: Expression[]) {
    super();
  }
}
