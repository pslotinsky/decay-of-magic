import type { Action, BattleDto, BattleEvent, CombatantId } from '@dod/engine';

import type { Candidate } from './candidate';

export type ObservationParams = {
  state: BattleDto;
  candidates: Candidate[];
  action: Action;
  events: BattleEvent[];
  scores: Record<CombatantId, number>;
};

/**
 * One decision-point record within a Trial: the observed state and legal
 * candidates, the chosen action, the engine event delta it produced, and the
 * resulting per-Combatant scores.
 */
export class Observation {
  public readonly state: BattleDto;
  public readonly candidates: Candidate[];
  public readonly action: Action;
  public readonly events: BattleEvent[];
  public readonly scores: Record<CombatantId, number>;

  public constructor(params: ObservationParams) {
    this.state = params.state;
    this.candidates = params.candidates;
    this.action = params.action;
    this.events = params.events;
    this.scores = params.scores;
  }
}
