import type { CodexContentDto, RulesetDto } from '@dod/engine';

import type { Protocol } from '../protocol/protocol.entity';
import type { Criterion } from '../scoring/criterion.entity';
import { CriterionScorer } from '../scoring/criterion-scorer';
import type { Feature } from '../scoring/feature';
import { ExperimentStatus } from '../types';
import { Experiment } from './experiment.entity';
import { ExperimentRunner } from './experiment-runner';
import { FindingsAggregation } from './findings-aggregation';

/** The resolved inputs a finished Experiment is produced from. */
export type ExperimentDraft = {
  id: string;
  protocol: Protocol;
  codex: CodexContentDto;
  ruleset: RulesetDto;
  features: Feature[];
  criteria: [Criterion, Criterion];
  trialCount: number;
  seed: string;
  createdAt: string;
  createdBy: string;
};

/**
 * Produces a finished Experiment from its resolved inputs: applies the
 * protocol's turn limit over the universe ruleset, runs the trial batch, and
 * aggregates the findings. The application layer resolves the draft; the domain
 * rules of conducting the experiment live here.
 */
export class ExperimentFactory {
  public constructor(
    private readonly runner: ExperimentRunner,
    private readonly aggregation: FindingsAggregation,
  ) {}

  public create(draft: ExperimentDraft): Experiment {
    const trials = this.runner.run({
      protocol: draft.protocol,
      codex: draft.codex,
      ruleset: { ...draft.ruleset, turnLimit: draft.protocol.turnLimit },
      scorer: new CriterionScorer(draft.features),
      criteria: draft.criteria,
      baseSeed: draft.seed,
      trialCount: draft.trialCount,
    });

    return new Experiment({
      id: draft.id,
      protocolId: draft.protocol.id,
      trialCount: draft.trialCount,
      seed: draft.seed,
      status: ExperimentStatus.Done,
      protocol: draft.protocol,
      codex: draft.codex,
      trials,
      findings: this.aggregation.aggregate(trials),
      createdAt: draft.createdAt,
      createdBy: draft.createdBy,
    });
  }
}
