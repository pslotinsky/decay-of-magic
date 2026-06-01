import { Entity } from '@dod/core';
import type { BattleDto, Outcome } from '@dod/engine';

import type { Observation } from './observation';

export type TrialParams = {
  id: string;
  seed: string;
  initialState: BattleDto;
  observations: Observation[];
  outcome: Outcome;
  turnsPlayed: number;
};

/**
 * One simulated game inside an Experiment — a read-only record of the
 * per-trial seed, the engine-determined initial state, the ordered Observation
 * log, the outcome, and the turn count.
 */
export class Trial extends Entity {
  public readonly id: string;
  public readonly seed: string;
  public readonly initialState: BattleDto;
  public readonly observations: Observation[];
  public readonly outcome: Outcome;
  public readonly turnsPlayed: number;

  public constructor(params: TrialParams) {
    super();
    this.id = params.id;
    this.seed = params.seed;
    this.initialState = params.initialState;
    this.observations = params.observations;
    this.outcome = params.outcome;
    this.turnsPlayed = params.turnsPlayed;
  }
}
