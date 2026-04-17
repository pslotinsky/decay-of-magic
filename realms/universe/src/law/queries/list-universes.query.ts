import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { UniverseDto } from '@/frontier/dto/universe.dto';
import { UniverseRepository } from '@/lore/repositories/universe.repository';

export class ListUniversesQuery extends Query<UniverseDto[]> {}

@QueryHandler(ListUniversesQuery)
export class ListUniversesHandler implements IQueryHandler<ListUniversesQuery> {
  @Inject() private readonly universeRepository!: UniverseRepository;

  public async execute(): Promise<UniverseDto[]> {
    const universes = await this.universeRepository.find();

    return universes.map((universe) => UniverseDto.from(universe));
  }
}
