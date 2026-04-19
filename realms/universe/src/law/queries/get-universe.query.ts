import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { UniverseDto, UniverseSchema } from '@dod/api-contract';

import { UniverseRepository } from '@/lore/repositories/universe.repository';

/**
 * Fetches a single universe by id. Fails when the id is unknown
 */
export class GetUniverseQuery extends Query<UniverseDto> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetUniverseQuery)
export class GetUniverseHandler implements IQueryHandler<GetUniverseQuery> {
  @Inject() private readonly universeRepository!: UniverseRepository;

  public async execute({ id }: GetUniverseQuery): Promise<UniverseDto> {
    const universe = await this.universeRepository.getByIdOrFail(id);

    return UniverseSchema.parse(universe);
  }
}
