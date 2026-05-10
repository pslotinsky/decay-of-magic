export type AppliesTo = 'minion' | 'hero' | 'card';

export type Activation =
  | 'emptySlot'
  | 'replaceOwnerMinion'
  | 'enemyMinion'
  | 'ownerMinion'
  | 'immediate';

export type Trigger =
  | 'onPlay'
  | 'onAfterPlay'
  | 'onTurnStart'
  | 'onTurnEnd'
  | 'onDeath'
  | 'onDamaged'
  | 'onBeforeDamage'
  | 'onDealDamage'
  | 'onAttack'
  | 'onBeforeAttack'
  | 'onSummon'
  | 'onOwnerMinionSummoned'
  | 'onEnemyMinionSummoned'
  | 'onOwnerMinionDied'
  | 'onEnemyMinionDied';

export type Target =
  | 'self'
  | 'ownerHero'
  | 'enemyHero'
  | 'chosen'
  | 'event'
  | 'oppositeSlot'
  | 'neighbors'
  | 'ownerMinions'
  | 'enemyMinions'
  | 'allMinions';

export type Targets = Target | Target[];

export type EffectKind =
  | 'damage'
  | 'heal'
  | 'fullHeal'
  | 'gainElement'
  | 'decreaseElement'
  | 'increaseStat'
  | 'decreaseStat'
  | 'multiplyStat'
  | 'setStat'
  | 'giveTraits'
  | 'removeTraits'
  | 'summon'
  | 'destroy'
  | 'attackNow'
  | 'preventDamage'
  | 'reflectDamage'
  | 'replaceWith';

export type Expression =
  | string
  | number
  | boolean
  | { not: Expression }
  | { ceil: Expression }
  | { count: Expression }
  | { and: Expression[] }
  | { or: Expression[] }
  | { eq: [Expression, Expression] }
  | { ne: [Expression, Expression] }
  | { lt: [Expression, Expression] }
  | { lte: [Expression, Expression] }
  | { gt: [Expression, Expression] }
  | { gte: [Expression, Expression] }
  | { add: Expression[] }
  | { sub: [Expression, Expression] }
  | { mul: Expression[] }
  | { div: [Expression, Expression] }
  | { min: Expression[] }
  | { max: Expression[] }
  | { contains: [Expression, Expression] }
  | { maxBy: [Expression, Expression] }
  | { rankBy: [Expression, Expression] }
  | { sumTopBy: [Expression, Expression, Expression] };

export type Effect =
  | { kind: 'damage'; params: { amount: Expression }; filter?: Expression }
  | { kind: 'heal'; params: { amount: Expression }; filter?: Expression }
  | { kind: 'fullHeal'; params: Record<string, never>; filter?: Expression }
  | {
      kind: 'gainElement';
      params: Record<string, Expression>;
      filter?: Expression;
    }
  | {
      kind: 'decreaseElement';
      params: Record<string, Expression>;
      filter?: Expression;
    }
  | {
      kind: 'increaseStat';
      params: Record<string, Expression>;
      filter?: Expression;
    }
  | {
      kind: 'decreaseStat';
      params: Record<string, Expression>;
      filter?: Expression;
    }
  | {
      kind: 'multiplyStat';
      params: Record<string, Expression>;
      filter?: Expression;
    }
  | {
      kind: 'setStat';
      params: Record<string, Expression>;
      filter?: Expression;
    }
  | {
      kind: 'giveTraits';
      params: { traits: string[]; duration?: number };
      filter?: Expression;
    }
  | {
      kind: 'removeTraits';
      params: { traits: string[] };
      filter?: Expression;
    }
  | { kind: 'summon'; params: { minion: string }; filter?: Expression }
  | { kind: 'destroy'; params: Record<string, never>; filter?: Expression }
  | { kind: 'attackNow'; params: { target?: Target }; filter?: Expression }
  | {
      kind: 'preventDamage';
      params: Record<string, never>;
      filter?: Expression;
    }
  | {
      kind: 'reflectDamage';
      params: Record<string, never>;
      filter?: Expression;
    }
  | { kind: 'replaceWith'; params: { card: string }; filter?: Expression };

export type Ability =
  | {
      trigger: Trigger;
      target: Targets;
      exclude?: Expression;
      effects: Effect[];
    }
  | {
      passive: true;
      target: Targets;
      exclude?: Expression;
      effects: Effect[];
    };
