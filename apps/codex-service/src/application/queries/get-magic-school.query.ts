import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { MagicSchool } from '@service/domain/entities/magic-school.entity';
import { MagicSchoolRepository } from '@service/domain/repositories/magic-school.repository';

export class GetMagicSchoolQuery extends Query<MagicSchool> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetMagicSchoolQuery)
export class GetMagicSchoolHandler
  implements IQueryHandler<GetMagicSchoolQuery>
{
  @Inject() private readonly MagicSchoolRepository: MagicSchoolRepository;

  public async execute({ id }: GetMagicSchoolQuery): Promise<MagicSchool> {
    return this.MagicSchoolRepository.getByIdOrFail(id);
  }
}
