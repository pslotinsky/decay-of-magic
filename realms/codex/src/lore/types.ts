export type AppliesTo = 'minion' | 'hero' | 'card';

export type Activation =
  | 'emptySlot'
  | 'enemyMinion'
  | 'ownerMinion'
  | 'immediate';

export type Trigger =
  | 'onPlay'
  | 'onTurnStart'
  | 'onTurnEnd'
  | 'onDeath'
  | 'onDamaged'
  | 'onBeforeDamage'
  | 'onAttack'
  | 'onBeforeAttack'
  | 'onSummon';

export type Target =
  | 'self'
  | 'ownerHero'
  | 'enemyHero'
  | 'chosen'
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
  | 'reflectDamage';

export type Expression =
  | string
  | number
  | boolean
  | { not: Expression }
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
  | { contains: [Expression, Expression] };

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
  | { kind: 'attackNow'; params: Record<string, never>; filter?: Expression }
  | {
      kind: 'preventDamage';
      params: Record<string, never>;
      filter?: Expression;
    }
  | {
      kind: 'reflectDamage';
      params: Record<string, never>;
      filter?: Expression;
    };

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
