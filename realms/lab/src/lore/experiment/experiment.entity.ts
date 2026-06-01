import { Entity } from '@dod/core';
import type { CodexContentDto } from '@dod/engine';

import type { Protocol } from '../protocol/protocol.entity';
import type { Trial } from '../trial/trial.entity';
import { ExperimentStatus } from '../types';
import type { Findings } from './findings';

export type ExperimentParams = {
  id: string;
  protocolId: string;
  trialCount: number;
  seed: string;
  status: ExperimentStatus;
  protocol: Protocol;
  codex: CodexContentDto;
  trials: Trial[];
  findings?: Findings;
  createdAt: string;
  createdBy: string;
};

/**
 * One execution of a Protocol — the historical record of a batch of
 * simulations. Freezes a resolved Protocol and Codex-content snapshot at start
 * for reproducibility; per-Trial seeds derive deterministically from its base
 * seed. Carries its Trials and the aggregated Findings once done.
 */
export class Experiment extends Entity {
  public readonly id: string;
  public readonly protocolId: string;
  public readonly trialCount: number;
  public readonly seed: string;
  public status: ExperimentStatus;
  public readonly protocol: Protocol;
  public readonly codex: CodexContentDto;
  public trials: Trial[];
  public findings?: Findings;
  public readonly createdAt: string;
  public readonly createdBy: string;

  public constructor(params: ExperimentParams) {
    super();
    this.id = params.id;
    this.protocolId = params.protocolId;
    this.trialCount = params.trialCount;
    this.seed = params.seed;
    this.status = params.status;
    this.protocol = params.protocol;
    this.codex = params.codex;
    this.trials = params.trials;
    this.findings = params.findings;
    this.createdAt = params.createdAt;
    this.createdBy = params.createdBy;
  }
}
