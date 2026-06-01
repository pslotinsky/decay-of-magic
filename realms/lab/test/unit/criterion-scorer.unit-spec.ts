import type { BattleDto } from '@dod/engine';

import { Criterion } from '../../src/lore/scoring/criterion.entity';
import { CriterionScorer } from '../../src/lore/scoring/criterion-scorer';
import { Feature } from '../../src/lore/scoring/feature';

function battle(): BattleDto {
  const hero = (health: number) => ({
    archetypeId: 'pyro',
    stats: { health },
    elements: {},
    traits: [],
  });
  return {
    combatants: [
      { id: 'a', hero: hero(30), hand: [], deck: [] },
      { id: 'b', hero: hero(25), hand: [], deck: [] },
    ],
    minions: [],
    turn: { activeCombatantId: 'a', number: 1 },
    outcome: null,
  };
}

const features = [
  new Feature('ownerHeroHealth', 'ownerHero.stats.health'),
  new Feature('heroHealthLead', {
    sub: ['ownerHero.stats.health', 'enemyHero.stats.health'],
  }),
];

const criterion = new Criterion({
  id: 'c1',
  universeId: 'u1',
  name: 'lead',
  weights: [
    { feature: 'ownerHeroHealth', weight: 1 },
    { feature: 'heroHealthLead', weight: 2 },
  ],
});

describe('CriterionScorer', () => {
  const scorer = new CriterionScorer(features);

  it('scores a state as the weighted sum of its features', () => {
    // 1*30 + 2*(30 - 25)
    expect(scorer.score(criterion, battle(), 'a')).toBe(40);
  });

  it('is relative to the scored Combatant', () => {
    // 1*25 + 2*(25 - 30)
    expect(scorer.score(criterion, battle(), 'b')).toBe(15);
  });

  it('throws when a weighted feature is not in the catalog', () => {
    const unknown = new Criterion({
      id: 'c2',
      universeId: 'u1',
      name: 'bad',
      weights: [{ feature: 'missing', weight: 1 }],
    });
    expect(() => scorer.score(unknown, battle(), 'a')).toThrow('missing');
  });
});
