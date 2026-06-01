import {
  BattleEngine,
  type BattleView,
  type ConstructInput,
  type PlayableCard,
} from '../BattleEngine';
import { BattleEvalContext } from '../BattleEvalContext';
import type { CardArchetype } from '../codex/CardArchetype';
import { CodexContent } from '../codex/CodexContent';
import type {
  Action,
  BattleEvent,
  CombatantId,
  Outcome,
  TargetRef,
} from '../contract';
import { IllegalActionError } from '../errors/IllegalActionError';
import { ExpressionFactory } from '../expression';
import { Battle } from '../model/Battle';
import type { Combatant } from '../model/Combatant';
import { Minion } from '../model/Minion';
import { Rng } from '../Rng';
import { Ruleset } from '../Ruleset';

interface MockState {
  battle: Battle;
  ruleset: Ruleset;
  codex: CodexContent;
  rng: Rng;
  onEvent?: (event: BattleEvent) => void;
  nextMinionSeq: number;
}

export function constructMock(input: ConstructInput): BattleEngine {
  const state: MockState = {
    battle: Battle.from(input.battle),
    ruleset: Ruleset.from(input.ruleset),
    codex: CodexContent.from(input.codex),
    rng: Rng.fromSeed(input.seed),
    onEvent: input.onEvent,
    nextMinionSeq: 0,
  };

  for (const combatant of state.battle.combatants) {
    state.rng.shuffle(combatant.deck);
    draw(state, combatant, state.ruleset.startingHandSize);
  }
  emit(state, {
    kind: 'TurnStartEvent',
    combatant: state.battle.turn.activeCombatantId,
  });

  return new MockEngine(state);
}

class MockEngine extends BattleEngine {
  private readonly expressions = new ExpressionFactory();

  public constructor(private readonly state: MockState) {
    super();
  }

  public observe(): BattleView {
    const { battle } = this.state;
    if (battle.outcome !== null) {
      return {
        battle: battle.toDto(),
        playableCards: [],
        targets: { ownerMinions: [], enemyMinions: [], emptySlots: [] },
      };
    }

    const active = battle.getActiveCombatant();
    const playableCards: PlayableCard[] = active.hand
      .filter((card) => this.affordable(card.archetypeId, active))
      .map((card) => ({
        cardId: card.id,
        activation: this.state.codex.getCard(card.archetypeId).activation,
      }));

    return {
      battle: battle.toDto(),
      playableCards,
      targets: {
        ownerMinions: battle.getMinionsOf(active.id).map((minion) => minion.id),
        enemyMinions: battle
          .getMinionsOf(battle.getOpponent(active.id).id)
          .map((minion) => minion.id),
        emptySlots: this.emptySlots(active.id),
      },
    };
  }

  public submit(action: Action): void {
    const { battle } = this.state;
    if (battle.outcome !== null) {
      throw new IllegalActionError('Battle has ended; no further actions');
    }

    if (action.kind === 'playCard') {
      this.resolvePlayCard(action);
    }
    this.endTurn();
  }

  public peek(action: Action): BattleEngine {
    const fork = new MockEngine({
      battle: this.state.battle.clone(),
      ruleset: this.state.ruleset,
      codex: this.state.codex,
      rng: this.state.rng.clone(),
      onEvent: undefined,
      nextMinionSeq: this.state.nextMinionSeq,
    });
    fork.submit(action);
    return fork;
  }

  private resolvePlayCard(action: Extract<Action, { kind: 'playCard' }>): void {
    const active = this.state.battle.getActiveCombatant();
    const card = active.hand.find((entry) => entry.id === action.cardId);
    if (card === undefined) {
      throw new IllegalActionError(
        `Card "${action.cardId}" is not in the active hand`,
      );
    }

    const archetype = this.state.codex.getCard(card.archetypeId);
    if (!this.affordable(card.archetypeId, active)) {
      throw new IllegalActionError(`Cannot afford card "${card.archetypeId}"`);
    }
    this.validateTarget(archetype, action.target, active.id);

    active.play(card.id);
    if (archetype.cost !== undefined) {
      active.hero.spend(archetype.cost);
    }
    emit(this.state, {
      kind: 'PlayEvent',
      combatant: active.id,
      card: card.archetypeId,
    });

    if (archetype.activation === 'emptySlot') {
      this.summon(
        archetype,
        (action.target as { slot: number }).slot,
        active.id,
      );
    }
  }

  private summon(
    archetype: CardArchetype,
    slot: number,
    controllerId: CombatantId,
  ): void {
    const ctx = new BattleEvalContext(this.state.battle, controllerId);
    const minion = new Minion(
      `m${this.state.nextMinionSeq++}`,
      archetype.id,
      controllerId,
      slot,
      archetype.rollStats(this.expressions, ctx),
      [],
    );
    this.state.battle.summon(minion);
    emit(this.state, { kind: 'SummonEvent', subject: minion.id });
  }

  private endTurn(): void {
    const { battle, ruleset } = this.state;
    const active = battle.getActiveCombatant();
    const enemy = battle.getOpponent(active.id);

    for (const minion of battle.getMinionsOf(active.id)) {
      this.dealToHero(minion.id, enemy.id, minion.attack, minion.archetypeId);
    }
    emit(this.state, { kind: 'TurnEndEvent', combatant: active.id });

    if (battle.getHero(enemy.id).isDead) {
      battle.end({ winner: active.id, reason: 'heroDefeated' });
      return;
    }
    if (battle.turn.number >= ruleset.turnLimit) {
      battle.end(this.turnLimitOutcome());
      return;
    }

    battle.advanceTo(enemy.id);
    emit(this.state, { kind: 'TurnStartEvent', combatant: enemy.id });
    draw(this.state, enemy, ruleset.drawPerTurn);
  }

  private dealToHero(
    sourceId: string,
    heroOwnerId: CombatantId,
    amount: number,
    sourceArchetype: string,
  ): void {
    if (amount <= 0) {
      return;
    }
    const lifeLost = this.state.battle.getHero(heroOwnerId).damage(amount);
    emit(this.state, {
      kind: 'DamageEvent',
      source: sourceId,
      sourceArchetype,
      target: heroOwnerId,
      damage: amount,
      lifeLost,
    });
  }

  private turnLimitOutcome(): Outcome {
    const [first, second] = this.state.battle.combatants;
    if (first.hero.health === second.hero.health) {
      return { winner: null, reason: 'turnLimit' };
    }
    const leader = first.hero.health > second.hero.health ? first : second;
    return { winner: leader.id, reason: 'turnLimit' };
  }

  private emptySlots(combatantId: CombatantId): number[] {
    const occupied = new Set(
      this.state.battle.getMinionsOf(combatantId).map((minion) => minion.slot),
    );
    const slots: number[] = [];
    for (let index = 0; index < this.state.ruleset.slotsPerCombatant; index++) {
      if (!occupied.has(index)) {
        slots.push(index);
      }
    }
    return slots;
  }

  private validateTarget(
    archetype: CardArchetype,
    target: TargetRef | undefined,
    combatantId: CombatantId,
  ): void {
    if (archetype.activation === 'emptySlot') {
      if (target === undefined || !('slot' in target)) {
        throw new IllegalActionError('Summon cards require a { slot } target');
      }
      if (!this.emptySlots(combatantId).includes(target.slot)) {
        throw new IllegalActionError(
          `Slot ${target.slot} is not an empty slot`,
        );
      }
      return;
    }
    if (archetype.activation === 'immediate') {
      if (target !== undefined) {
        throw new IllegalActionError('Immediate cards take no target');
      }
      return;
    }
    if (target === undefined || !('minion' in target)) {
      throw new IllegalActionError(
        `Activation "${archetype.activation}" requires a { minion } target`,
      );
    }
  }

  private affordable(archetypeId: string, combatant: Combatant): boolean {
    const cost = this.state.codex.getCard(archetypeId).cost;
    return cost === undefined || combatant.hero.affords(cost);
  }
}

function draw(state: MockState, combatant: Combatant, count: number): void {
  let deckEmpty = false;

  for (let index = 0; index < count && !deckEmpty; index++) {
    deckEmpty = combatant.draw() === undefined;
  }

  if (deckEmpty) {
    state.battle.end({
      winner: state.battle.getOpponent(combatant.id).id,
      reason: 'deckOut',
    });
  }
}

function emit(state: MockState, event: BattleEvent): void {
  state.onEvent?.(event);
}
