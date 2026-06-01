import { ContainsExpression } from './binary/ContainsExpression';
import { DivExpression } from './binary/DivExpression';
import { EqExpression } from './binary/EqExpression';
import { MaxByExpression } from './binary/MaxByExpression';
import { NeExpression } from './binary/NeExpression';
import { RankByExpression } from './binary/RankByExpression';
import { SubExpression } from './binary/SubExpression';
import { GtExpression } from './comparison/GtExpression';
import { GteExpression } from './comparison/GteExpression';
import { LtExpression } from './comparison/LtExpression';
import { LteExpression } from './comparison/LteExpression';
import { Expression, type ExpressionParser } from './Expression';
import { AddExpression } from './nary/AddExpression';
import { AndExpression } from './nary/AndExpression';
import { MaxExpression } from './nary/MaxExpression';
import { MinExpression } from './nary/MinExpression';
import { MulExpression } from './nary/MulExpression';
import { OrExpression } from './nary/OrExpression';
import { LiteralExpression } from './other/LiteralExpression';
import { PathExpression } from './other/PathExpression';
import { SumTopByExpression } from './other/SumTopByExpression';
import type { ExpressionDefinition } from './types';
import { CeilExpression } from './unary/CeilExpression';
import { CountExpression } from './unary/CountExpression';
import { NotExpression } from './unary/NotExpression';

interface ExpressionNode {
  readonly operator: string;
  build(parser: ExpressionParser, argument: unknown): Expression;
}

const NODES: ExpressionNode[] = [
  NotExpression,
  CeilExpression,
  CountExpression,
  AndExpression,
  OrExpression,
  AddExpression,
  MulExpression,
  MinExpression,
  MaxExpression,
  SubExpression,
  DivExpression,
  EqExpression,
  NeExpression,
  ContainsExpression,
  MaxByExpression,
  RankByExpression,
  LtExpression,
  LteExpression,
  GtExpression,
  GteExpression,
  SumTopByExpression,
];

/** Parses Codex expression JSON into an executable expression tree, dispatching each operator keyword to the node that owns it. */
export class ExpressionFactory implements ExpressionParser {
  private readonly registry = new Map<string, ExpressionNode>(
    NODES.map((node) => [node.operator, node]),
  );

  public from(json: ExpressionDefinition): Expression {
    let expression: Expression;

    if (typeof json === 'string') {
      expression = new PathExpression(json);
    } else if (typeof json === 'number' || typeof json === 'boolean') {
      expression = new LiteralExpression(json);
    } else {
      expression = this.fromOperator(json);
    }

    return expression;
  }

  private fromOperator(
    json: Exclude<ExpressionDefinition, string | number | boolean>,
  ): Expression {
    const [operator, argument] = Object.entries(json)[0];
    const node = this.registry.get(operator);

    if (!node) {
      throw new Error(`Unknown expression operator: ${JSON.stringify(json)}`);
    }

    return node.build(this, argument);
  }
}
