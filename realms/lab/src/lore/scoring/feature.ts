import type { ExpressionDefinition } from '@dod/engine';

/**
 * A named expression over match state that evaluates to a number (booleans
 * coerce to 0/1). Authored value object referenced by Criterion weights;
 * `owner*` / `enemy*` resolve relative to the Combatant being scored.
 */
export class Feature {
  public constructor(
    public readonly name: string,
    public readonly expression: ExpressionDefinition,
  ) {}
}
