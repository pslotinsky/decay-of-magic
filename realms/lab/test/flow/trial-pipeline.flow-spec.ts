import type { BattleDto, CodexContentDto, RulesetDto } from '@dod/engine';

import { ExperimentRunner } from '../../src/lore/experiment/experiment-runner';
import { FindingsAggregation } from '../../src/lore/experiment/findings-aggregation';
import { TrialSession } from '../../src/lore/experiment/trial-session';
import { GreedyGuineaPig } from '../../src/lore/guinea-pig/greedy-guinea-pig';
import { RandomGuineaPig } from '../../src/lore/guinea-pig/random-guinea-pig';
import { Protocol } from '../../src/lore/protocol/protocol.entity';
import { Side } from '../../src/lore/protocol/side';
import { Criterion } from '../../src/lore/scoring/criterion.entity';
import { CriterionScorer } from '../../src/lore/scoring/criterion-scorer';
import { Feature } from '../../src/lore/scoring/feature';

const RULESET: RulesetDto = {
  slotsPerCombatant: 4,
  startingHandSize: 3,
  drawPerTurn: 1,
  turnLimit: 50,
};

const CODEX: CodexContentDto = {
  heroes: [],
  cards: [
    { id: 'grunt', activation: 'emptySlot', stats: { attack: 3, health: 4 } },
    { id: 'bolt', activation: 'immediate' },
  ],
};

const UNIVERSE = 'arcana';

type Combatant = BattleDto['combatants'][number];

function deck(combatantId: string): Combatant['deck'] {
  const cards: Combatant['deck'] = [];
  for (let index = 0; index < 12; index++) {
    cards.push({
      id: `${combatantId}#${index}`,
      archetypeId: index % 2 === 0 ? 'grunt' : 'bolt',
    });
  }
  return cards;
}

function combatant(id: string): Combatant {
  return {
    id,
    hero: {
      archetypeId: 'pyro',
      stats: { health: 30 },
      elements: {},
      traits: [],
    },
    hand: [],
    deck: deck(id),
  };
}

function initialState(): BattleDto {
  return {
    combatants: [combatant('a'), combatant('b')],
    minions: [],
    turn: { activeCombatantId: 'a', number: 1 },
    outcome: null,
  };
}

const features = [
  new Feature('ownerHealth', 'ownerHero.stats.health'),
  new Feature('enemyHealth', 'enemyHero.stats.health'),
];

function criterion(): Criterion {
  return new Criterion({
    id: 'c1',
    universeId: UNIVERSE,
    name: 'race',
    weights: [
      { feature: 'ownerHealth', weight: 1 },
      { feature: 'enemyHealth', weight: -1 },
    ],
  });
}

function protocol(): Protocol {
  return new Protocol({
    id: 'p1',
    universeId: UNIVERSE,
    initialState: initialState(),
    sides: [
      new Side(new GreedyGuineaPig(), 'c1'),
      new Side(new RandomGuineaPig(), 'c1'),
    ],
    turnLimit: RULESET.turnLimit,
  });
}

function setup(): {
  protocol: Protocol;
  codex: CodexContentDto;
  ruleset: RulesetDto;
  scorer: CriterionScorer;
  criteria: [Criterion, Criterion];
} {
  return {
    protocol: protocol(),
    codex: CODEX,
    ruleset: RULESET,
    scorer: new CriterionScorer(features),
    criteria: [criterion(), criterion()],
  };
}

describe('trial pipeline', () => {
  it('plays a trial through to a terminal outcome', () => {
    const trial = new TrialSession(setup(), 'seed-1').play();

    expect(trial.outcome).not.toBeNull();
    expect(trial.observations.length).toBeGreaterThan(0);
    expect(trial.turnsPlayed).toBeGreaterThanOrEqual(1);
  });

  it('records a full observation at each decision point', () => {
    const trial = new TrialSession(setup(), 'seed-1').play();
    const [first] = trial.observations;

    expect(first.action).toBeDefined();
    expect(first.candidates).toContainEqual(
      expect.objectContaining({ action: { kind: 'endTurn' } }),
    );
    expect(Array.isArray(first.events)).toBe(true);
    expect(Object.keys(first.scores).sort()).toEqual(['a', 'b']);
  });

  it('is deterministic — same seed reproduces the same trial', () => {
    const first = new TrialSession(setup(), 'seed-42').play();
    const replay = new TrialSession(setup(), 'seed-42').play();

    expect(replay.outcome).toEqual(first.outcome);
    expect(replay.turnsPlayed).toBe(first.turnsPlayed);
    expect(
      replay.observations.map((observation) => observation.action),
    ).toEqual(first.observations.map((observation) => observation.action));
  });

  it('derives independent, reproducible trials across the batch', () => {
    const trials = new ExperimentRunner().run({
      ...setup(),
      baseSeed: 'batch',
      trialCount: 4,
    });
    const replay = new ExperimentRunner().run({
      ...setup(),
      baseSeed: 'batch',
      trialCount: 4,
    });

    expect(trials).toHaveLength(4);
    expect(trials.map((trial) => trial.id)).toEqual([
      'batch:0',
      'batch:1',
      'batch:2',
      'batch:3',
    ]);
    expect(replay.map((trial) => trial.outcome)).toEqual(
      trials.map((trial) => trial.outcome),
    );
  });

  it('aggregates the batch into findings', () => {
    const trials = new ExperimentRunner().run({
      ...setup(),
      baseSeed: 'batch',
      trialCount: 6,
    });
    const findings = new FindingsAggregation().aggregate(trials);

    expect(findings.sampleSize).toBe(6);
    expect(findings.winRates).toHaveLength(2);
    const lengths = Object.values(findings.lengthDistribution);
    expect(lengths.reduce((sum, count) => sum + count, 0)).toBe(6);
    const terminations = Object.values(findings.terminationReasons);
    expect(terminations.reduce((sum, count) => sum + count, 0)).toBe(6);
  });
});
