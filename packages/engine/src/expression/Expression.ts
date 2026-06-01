import type { EvalContext } from './context';
import type { Entity, ExpressionDefinition, Value } from './types';

export interface ExpressionParser {
  from(json: ExpressionDefinition): Expression;
}

/** Base of the expression AST: evaluates against a perspective into a live battle and yields a number, boolean, string, or entity collection. */
export abstract class Expression {
  public evaluateNumber(ctx: EvalContext): number {
    return this.toNumber(this.evaluate(ctx));
  }

  public evaluateString(ctx: EvalContext): string {
    return String(this.evaluate(ctx));
  }

  public abstract evaluate(ctx: EvalContext): Value;

  protected toNumber(value: Value): number {
    let result: number;

    if (typeof value === 'number') {
      result = value;
    } else if (typeof value === 'boolean') {
      result = value ? 1 : 0;
    } else {
      throw new Error(`Expected a number, got ${JSON.stringify(value)}`);
    }

    return result;
  }

  protected toBoolean(value: Value): boolean {
    let result: boolean;

    if (typeof value === 'boolean') {
      result = value;
    } else if (typeof value === 'number') {
      result = value !== 0;
    } else {
      throw new Error(`Expected a boolean, got ${JSON.stringify(value)}`);
    }

    return result;
  }

  protected toList(value: Value): Entity[] {
    if (!Array.isArray(value)) {
      throw new Error(`Expected a collection, got ${JSON.stringify(value)}`);
    }

    return value as Entity[];
  }

  protected toStrings(value: Value): string[] {
    if (!Array.isArray(value)) {
      throw new Error(`Expected a list, got ${JSON.stringify(value)}`);
    }

    return value.map((item) => String(item));
  }

  protected statOf(entity: Entity, stat: string): number {
    return entity.stats[stat] ?? 0;
  }
}
