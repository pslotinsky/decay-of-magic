import { Entity } from '@dod/core';
import type { BattleDto } from '@dod/engine';

import type { Side } from '../value-objects/side';

export type ProtocolParams = {
  id: string;
  name?: string;
  universeId: string;
  initialState: BattleDto;
  sides: [Side, Side];
  turnLimit: number;
};

/**
 * Reusable specification of what to test: which Universe, the engine-defined
 * initial state, a Guinea Pig and Criterion per side, and a turn-limit guard.
 * Describes what to test, not how thoroughly — sample size and seed live on
 * the Experiment.
 */
export class Protocol extends Entity {
  public readonly id: string;
  public name?: string;
  public readonly universeId: string;
  public initialState: BattleDto;
  public sides: [Side, Side];
  public turnLimit: number;

  public constructor(params: ProtocolParams) {
    super();
    this.id = params.id;
    this.name = params.name;
    this.universeId = params.universeId;
    this.initialState = params.initialState;
    this.sides = params.sides;
    this.turnLimit = params.turnLimit;
  }
}
