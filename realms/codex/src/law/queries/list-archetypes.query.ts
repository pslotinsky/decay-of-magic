import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { ArchetypeKind } from '@/lore/entities/archetype.entity';
import { ArchetypeRepository } from '@/lore/repositories/archetype.repository';

export class ListArchetypesQuery<TDto = unknown> extends Query<TDto[]> {
  constructor(
    public readonly kind: ArchetypeKind,
    public readonly universeId: string,
  ) {
    super();
  }
}

@QueryHandler(ListArchetypesQuery)
export class ListArchetypesHandler implements IQueryHandler<ListArchetypesQuery> {
  @Inject() private readonly archetypeRepository!: ArchetypeRepository;

  public async execute({
    kind,
    universeId,
  }: ListArchetypesQuery): Promise<unknown[]> {
    const archetypes = await this.archetypeRepository.find({
      universeId,
      kind,
    });

    return archetypes.map((archetype) => archetype.toDto());
  }
}
