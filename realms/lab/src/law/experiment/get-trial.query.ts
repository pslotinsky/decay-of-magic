import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { NotFoundError } from '@dod/core';

import { ExperimentRepository } from '../../lore/experiment/experiment.repository';
import type { Trial } from '../../lore/trial/trial.entity';

export class GetTrialQuery extends Query<Trial> {
  public constructor(
    public readonly experimentId: string,
    public readonly trialId: string,
  ) {
    super();
  }
}

@QueryHandler(GetTrialQuery)
export class GetTrialHandler implements IQueryHandler<GetTrialQuery> {
  @Inject() private readonly experiments!: ExperimentRepository;

  public async execute({
    experimentId,
    trialId,
  }: GetTrialQuery): Promise<Trial> {
    const experiment = await this.experiments.getByIdOrFail(experimentId);
    const trial = experiment.trials.find((entry) => entry.id === trialId);

    if (trial === undefined) {
      throw new NotFoundError(
        `Trial "${trialId}" not found in experiment "${experimentId}"`,
      );
    }

    return trial;
  }
}
