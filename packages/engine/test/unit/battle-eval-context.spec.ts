import { Battle, BattleEvalContext, ExpressionFactory } from '../../src';

const battle = Battle.from({
  combatants: [
    {
      id: 'a',
      hero: {
        archetypeId: 'pyro',
        stats: { health: 30 },
        elements: {},
        traits: [],
      },
      hand: [],
      deck: [],
    },
    {
      id: 'b',
      hero: {
        archetypeId: 'pyro',
        stats: { health: 25 },
        elements: {},
        traits: [],
      },
      hand: [],
      deck: [],
    },
  ],
  minions: [],
  turn: { activeCombatantId: 'a', number: 1 },
  outcome: null,
});

const factory = new ExpressionFactory();

describe('BattleEvalContext', () => {
  it('resolves side-relative paths from the perspective', () => {
    const ctx = new BattleEvalContext(battle, 'a');
    expect(ctx.resolve('ownerHero.stats.health')).toBe(30);
    expect(ctx.resolve('enemyHero.stats.health')).toBe(25);
  });

  it('evaluates an expression across perspectives', () => {
    const ctx = new BattleEvalContext(battle, 'a');
    const expression = factory.from({
      sub: ['ownerHero.stats.health', 'enemyHero.stats.health'],
    });
    expect(expression.evaluateNumber(ctx)).toBe(5);
  });

  it('returns the literal token for an unknown root', () => {
    const ctx = new BattleEvalContext(battle, 'a');
    expect(ctx.resolve('attack')).toBe('attack');
  });
});
