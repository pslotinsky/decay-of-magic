import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Criterion } from '../../lore/scoring/criterion.entity';
import { CriterionRepository } from '../../lore/scoring/criterion.repository';

export class GetCriterionQuery extends Query<Criterion> {
  public constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetCriterionQuery)
export class GetCriterionHandler implements IQueryHandler<GetCriterionQuery> {
  @Inject() private readonly criteria!: CriterionRepository;

  public async execute({ id }: GetCriterionQuery): Promise<Criterion> {
    return this.criteria.getByIdOrFail(id);
  }
}
