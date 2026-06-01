import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Criterion } from '../../lore/scoring/criterion.entity';
import { CriterionRepository } from '../../lore/scoring/criterion.repository';

export class ListCriteriaQuery extends Query<Criterion[]> {
  public constructor(public readonly universeId: string) {
    super();
  }
}

@QueryHandler(ListCriteriaQuery)
export class ListCriteriaHandler implements IQueryHandler<ListCriteriaQuery> {
  @Inject() private readonly criteria!: CriterionRepository;

  public async execute({
    universeId,
  }: ListCriteriaQuery): Promise<Criterion[]> {
    return this.criteria.find({ universeId });
  }
}
