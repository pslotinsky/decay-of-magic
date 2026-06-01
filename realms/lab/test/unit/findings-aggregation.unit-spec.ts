import type { BattleDto, Outcome } from '@dod/engine';

import { FindingsAggregation } from '../../src/lore/experiment/findings-aggregation';
import { Trial } from '../../src/lore/trial/trial.entity';

function initialState(): BattleDto {
  const side = (id: string) => ({
    id,
    hero: {
      archetypeId: 'pyro',
      stats: { health: 30 },
      elements: {},
      traits: [],
    },
    hand: [],
    deck: [],
  });
  return {
    combatants: [side('a'), side('b')],
    minions: [],
    turn: { activeCombatantId: 'a', number: 1 },
    outcome: null,
  };
}

function trial(id: string, outcome: Outcome, turnsPlayed: number): Trial {
  return new Trial({
    id,
    seed: id,
    initialState: initialState(),
    observations: [],
    outcome,
    turnsPlayed,
  });
}

describe('FindingsAggregation', () => {
  const aggregation = new FindingsAggregation();

  it('computes win rates per combatant over the batch', () => {
    const findings = aggregation.aggregate([
      trial('t1', { winner: 'a', reason: 'heroDefeated' }, 8),
      trial('t2', { winner: 'a', reason: 'heroDefeated' }, 10),
      trial('t3', { winner: 'b', reason: 'deckOut' }, 12),
    ]);

    expect(findings.sampleSize).toBe(3);
    const a = findings.winRates.find((rate) => rate.combatantId === 'a');
    expect(a?.rate).toBeCloseTo(2 / 3);
    expect(a?.inconclusive).toBe(true);
  });

  it('counts the length distribution and termination reasons', () => {
    const findings = aggregation.aggregate([
      trial('t1', { winner: 'a', reason: 'heroDefeated' }, 8),
      trial('t2', { winner: 'b', reason: 'heroDefeated' }, 8),
      trial('t3', { winner: null, reason: 'turnLimit' }, 12),
    ]);

    expect(findings.lengthDistribution[8]).toBe(2);
    expect(findings.lengthDistribution[12]).toBe(1);
    expect(findings.terminationReasons.heroDefeated).toBe(2);
    expect(findings.terminationReasons.turnLimit).toBe(1);
  });

  it('returns empty findings for no trials', () => {
    const findings = aggregation.aggregate([]);
    expect(findings.sampleSize).toBe(0);
    expect(findings.winRates).toEqual([]);
  });
});
