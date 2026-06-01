import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Experiment } from '../../lore/experiment/experiment.entity';
import { ExperimentRepository } from '../../lore/experiment/experiment.repository';

export class GetExperimentQuery extends Query<Experiment> {
  public constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetExperimentQuery)
export class GetExperimentHandler implements IQueryHandler<GetExperimentQuery> {
  @Inject() private readonly experiments!: ExperimentRepository;

  public async execute({ id }: GetExperimentQuery): Promise<Experiment> {
    return this.experiments.getByIdOrFail(id);
  }
}
