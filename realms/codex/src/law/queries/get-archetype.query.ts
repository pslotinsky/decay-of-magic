import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { ArchetypeKind } from '@/lore/entities/archetype.entity';
import { ArchetypeRepository } from '@/lore/repositories/archetype.repository';

export class GetArchetypeQuery<TDto = unknown> extends Query<TDto> {
  constructor(
    public readonly kind: ArchetypeKind,
    public readonly id: string,
  ) {
    super();
  }
}

@QueryHandler(GetArchetypeQuery)
export class GetArchetypeHandler implements IQueryHandler<GetArchetypeQuery> {
  @Inject() private readonly archetypeRepository!: ArchetypeRepository;

  public async execute({ kind, id }: GetArchetypeQuery): Promise<unknown> {
    const archetype = await this.archetypeRepository.findOneOrFail({
      id,
      kind,
    });

    return archetype.toDto();
  }
}
