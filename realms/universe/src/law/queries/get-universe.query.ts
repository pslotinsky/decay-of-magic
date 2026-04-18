import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { UniverseDto } from '@/frontier/dto/universe.dto';
import { UniverseRepository } from '@/lore/repositories/universe.repository';

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

    return UniverseDto.from(universe);
  }
}
