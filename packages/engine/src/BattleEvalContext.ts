import type { CombatantId } from './contract';
import { type Entity, EvalContext, type Value } from './expression';
import type { Battle } from './model/Battle';

/**
 * Resolves DSL paths against a live battle from one combatant's perspective —
 * the roots `ownerHero`, `enemyMinions`, `self`, `target`, and so on — then
 * walks the remaining segments into the addressed object.
 */
export class BattleEvalContext extends EvalContext {
  public constructor(
    private readonly battle: Battle,
    private readonly perspective: CombatantId,
    private readonly self?: Entity,
    public readonly target?: Entity,
  ) {
    super();
  }

  public withTarget(target: Entity): BattleEvalContext {
    return new BattleEvalContext(
      this.battle,
      this.perspective,
      this.self,
      target,
    );
  }

  public resolve(token: string): Value {
    const [root, ...path] = token.split('.');
    const base = this.resolveRoot(root);
    if (base === undefined) {
      return token;
    }
    return walk(base, path, token);
  }

  private resolveRoot(root: string): Value | undefined {
    switch (root) {
      case 'ownerHero':
        return this.battle.getHero(this.perspective);
      case 'enemyHero':
        return this.battle.getOpponent(this.perspective).hero;
      case 'ownerMinions':
        return this.battle.getMinionsOf(this.perspective);
      case 'enemyMinions':
        return this.battle.getMinionsOf(
          this.battle.getOpponent(this.perspective).id,
        );
      case 'allMinions':
        return this.battle.minions;
      case 'self':
        return this.self;
      case 'target':
        return this.target;
      default:
        return undefined;
    }
  }
}

function walk(base: Value, path: string[], token: string): Value {
  let current: unknown = base;
  for (const segment of path) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      throw new Error(`Cannot read "${segment}" in path "${token}"`);
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current as Value;
}
