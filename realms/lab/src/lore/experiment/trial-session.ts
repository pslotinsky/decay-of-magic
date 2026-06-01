import {
  type BattleDto,
  type BattleEngine,
  type BattleView,
  type CodexContentDto,
  type CombatantId,
  constructMock,
  type Outcome,
  Rng,
  type RulesetDto,
} from '@dod/engine';

import type { Protocol } from '../protocol/protocol.entity';
import type { Criterion } from '../scoring/criterion.entity';
import type { CriterionScorer } from '../scoring/criterion-scorer';
import { Candidate } from '../trial/candidate';
import { Observation } from '../trial/observation';
import { Trial } from '../trial/trial.entity';
import { Contestant } from './contestant';
import { EventRecorder } from './event-recorder';
import { LegalActions } from './legal-actions';

/** Everything a single Trial needs from its parent Experiment. */
export type TrialSetup = {
  protocol: Protocol;
  codex: CodexContentDto;
  ruleset: RulesetDto;
  scorer: CriterionScorer;
  criteria: [Criterion, Criterion];
};

/**
 * Plays one Trial against a fresh deterministic engine. Each decision point
 * lets the active side's Guinea Pig pick an action, then records an Observation
 * — the state seen, the candidates, the chosen action, its event delta, and the
 * resulting per-Combatant scores — until the engine sets an Outcome.
 */
export class TrialSession {
  private readonly recorder = new EventRecorder();
  private readonly engine: BattleEngine;
  private readonly contestants: Contestant[];
  private readonly initialState: BattleDto;
  private readonly observations: Observation[] = [];

  public constructor(
    setup: TrialSetup,
    private readonly seed: string,
  ) {
    this.engine = constructMock({
      codex: setup.codex,
      ruleset: setup.ruleset,
      battle: setup.protocol.initialState,
      seed,
      onEvent: (event) => this.recorder.record(event),
    });
    const rng = Rng.fromSeed(seed);
    this.contestants = setup.protocol.sides.map(
      (side, index) =>
        new Contestant(
          side.guineaPig,
          setup.criteria[index],
          setup.scorer,
          this.engine,
          rng,
        ),
    );
    this.initialState = this.engine.observe().battle;
    this.recorder.drain();
  }

  public play(): Trial {
    let view = this.engine.observe();
    while (view.battle.outcome === null) {
      this.observations.push(this.advance(view));
      view = this.engine.observe();
    }
    return this.toTrial(view.battle.outcome, view.battle.turn.number);
  }

  private advance(view: BattleView): Observation {
    const before = view.battle;
    const sideIndex = this.findActiveSide(before);
    const actions = new LegalActions(view).list();
    const action = this.contestants[sideIndex].pick(
      before.turn.activeCombatantId,
      actions,
    );

    this.engine.submit(action);

    return new Observation({
      state: before,
      candidates: actions.map((candidate) => new Candidate(candidate)),
      action,
      events: this.recorder.drain(),
      scores: this.scoreCombatants(this.engine.observe().battle),
    });
  }

  private findActiveSide(battle: BattleDto): number {
    return battle.combatants.findIndex(
      (combatant) => combatant.id === battle.turn.activeCombatantId,
    );
  }

  private scoreCombatants(battle: BattleDto): Record<CombatantId, number> {
    const scores: Record<CombatantId, number> = {};
    battle.combatants.forEach((combatant, index) => {
      scores[combatant.id] = this.contestants[index].score(
        battle,
        combatant.id,
      );
    });
    return scores;
  }

  private toTrial(outcome: Outcome, turnsPlayed: number): Trial {
    return new Trial({
      id: this.seed,
      seed: this.seed,
      initialState: this.initialState,
      observations: this.observations,
      outcome,
      turnsPlayed,
    });
  }
}
