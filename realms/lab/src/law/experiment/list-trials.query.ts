import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { ExperimentRepository } from '../../lore/experiment/experiment.repository';
import type { Trial } from '../../lore/trial/trial.entity';

export class ListTrialsQuery extends Query<Trial[]> {
  public constructor(public readonly experimentId: string) {
    super();
  }
}

@QueryHandler(ListTrialsQuery)
export class ListTrialsHandler implements IQueryHandler<ListTrialsQuery> {
  @Inject() private readonly experiments!: ExperimentRepository;

  public async execute({ experimentId }: ListTrialsQuery): Promise<Trial[]> {
    const experiment = await this.experiments.getByIdOrFail(experimentId);
    return experiment.trials;
  }
}
