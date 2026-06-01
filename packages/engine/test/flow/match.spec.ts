import {
  type Action,
  type BattleDto,
  type BattleEngine,
  type CodexContentDto,
  constructMock,
  type RulesetDto,
} from '../../src';

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

type Side = BattleDto['combatants'][number];

function deck(combatantId: string): Side['deck'] {
  const cards: Side['deck'] = [];

  for (let index = 0; index < 12; index++) {
    cards.push({
      id: `${combatantId}#${index}`,
      archetypeId: index % 2 === 0 ? 'grunt' : 'bolt',
    });
  }

  return cards;
}

function side(id: string): Side {
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

function initialBattle(): BattleDto {
  return {
    combatants: [side('a'), side('b')],
    minions: [],
    turn: { activeCombatantId: 'a', number: 1 },
    outcome: null,
  };
}

function construct(
  seed: string,
  onEvent?: (event: unknown) => void,
): BattleEngine {
  return constructMock({
    codex: CODEX,
    ruleset: RULESET,
    battle: initialBattle(),
    seed,
    onEvent: onEvent as never,
  });
}

function playOut(engine: BattleEngine): { actions: Action[] } {
  const actions: Action[] = [];
  for (let step = 0; step < 1000; step++) {
    const point = engine.observe();
    if (point.battle.outcome !== null) {
      return { actions };
    }
    const playable = point.playableCards[0];
    const action: Action =
      playable !== undefined
        ? {
            kind: 'playCard',
            cardId: playable.cardId,
            ...(playable.activation === 'emptySlot'
              ? { target: { slot: point.targets.emptySlots[0] } }
              : {}),
          }
        : { kind: 'endTurn' };
    engine.submit(action);
    actions.push(action);
  }
  throw new Error('match did not terminate within 1000 steps');
}

describe('match flow', () => {
  it('plays a match to a set outcome', () => {
    expect(playOut(construct('seed-1')).actions.length).toBeGreaterThan(0);
  });

  it('is deterministic — same seed + same actions reproduce the same outcome', () => {
    const first = playOut(construct('seed-42'));
    const replay = construct('seed-42');
    for (const action of first.actions) {
      replay.submit(action);
    }
    const original = construct('seed-42');
    for (const action of first.actions) {
      original.submit(action);
    }
    expect(replay.observe().battle.outcome).toEqual(
      original.observe().battle.outcome,
    );
  });

  it('runs independently across seeds', () => {
    expect(playOut(construct('seed-A')).actions.length).toBeGreaterThan(0);
    expect(playOut(construct('seed-B')).actions.length).toBeGreaterThan(0);
  });

  it('peek does not mutate the live battle', () => {
    const engine = construct('seed-peek');
    const turnBefore = engine.observe().battle.turn.number;
    const fork = engine.peek({ kind: 'endTurn' });
    expect(engine.observe().battle.turn.number).toBe(turnBefore);
    expect(engine.observe().battle.outcome).toBeNull();
    expect(fork.observe().battle.turn.number).toBe(turnBefore + 1);
  });

  it('fires events to the listener during submit', () => {
    const events: Array<{ kind: string }> = [];
    const engine = construct('seed-events', (event) =>
      events.push(event as { kind: string }),
    );
    engine.submit({ kind: 'endTurn' });
    expect(events.some((event) => event.kind === 'TurnEndEvent')).toBe(true);
  });

  it('rejects an action after the battle has ended', () => {
    const engine = construct('seed-end');
    playOut(engine);
    expect(() => engine.submit({ kind: 'endTurn' })).toThrow();
  });
});
