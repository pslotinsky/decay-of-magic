import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Mana } from '@service/domain/entities/mana.entity';
import { ManaRepository } from '@service/domain/repositories/mana.repository';

export class FindManaQuery extends Query<Mana[]> {}

@QueryHandler(FindManaQuery)
export class FindManaHandler implements IQueryHandler<FindManaQuery> {
  @Inject() private readonly schoolRepository: ManaRepository;

  public async execute(): Promise<Mana[]> {
    return this.schoolRepository.find();
  }
}
