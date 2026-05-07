import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { UniverseSummaryDto, UniverseSummarySchema } from '@dod/api-contract';

import { UniverseRepository } from '@/lore/repositories/universe.repository';

/**
 * Lists every universe currently registered in the realm. Returns the
 * summary projection (no settings) to keep the list view light
 */
export class ListUniversesQuery extends Query<UniverseSummaryDto[]> {}

@QueryHandler(ListUniversesQuery)
export class ListUniversesHandler implements IQueryHandler<ListUniversesQuery> {
  @Inject() private readonly universeRepository!: UniverseRepository;

  public async execute(): Promise<UniverseSummaryDto[]> {
    const universes = await this.universeRepository.find();

    return universes.map((universe) => UniverseSummarySchema.parse(universe));
  }
}
