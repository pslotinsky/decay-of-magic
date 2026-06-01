import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Experiment } from '../../lore/experiment/experiment.entity';
import { ExperimentRepository } from '../../lore/experiment/experiment.repository';

export class ListExperimentsQuery extends Query<Experiment[]> {
  public constructor(public readonly protocolId: string) {
    super();
  }
}

@QueryHandler(ListExperimentsQuery)
export class ListExperimentsHandler
  implements IQueryHandler<ListExperimentsQuery>
{
  @Inject() private readonly experiments!: ExperimentRepository;

  public async execute({
    protocolId,
  }: ListExperimentsQuery): Promise<Experiment[]> {
    return this.experiments.find({ protocolId });
  }
}
