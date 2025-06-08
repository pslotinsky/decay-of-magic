import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { MagicSchool } from '@service/domain/entities/magic-school.entity';
import { MagicSchoolRepository } from '@service/domain/repositories/magic-school.repository';

export class FindMagicSchoolsQuery extends Query<MagicSchool[]> {}

@QueryHandler(FindMagicSchoolsQuery)
export class FindMagicSchoolsHandler
  implements IQueryHandler<FindMagicSchoolsQuery>
{
  @Inject() private readonly schoolRepository: MagicSchoolRepository;

  public async execute(): Promise<MagicSchool[]> {
    return this.schoolRepository.find();
  }
}
