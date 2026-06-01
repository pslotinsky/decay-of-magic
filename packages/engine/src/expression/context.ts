import type { Entity, Value } from './types';

/**
 * The contract an expression evaluates against: a resolver from DSL paths to
 * values, plus the current target candidate. Binding these to a concrete
 * battle is the caller's responsibility, not the expression layer's.
 */
export abstract class EvalContext {
  public abstract readonly target?: Entity;

  public abstract resolve(path: string): Value;
}
