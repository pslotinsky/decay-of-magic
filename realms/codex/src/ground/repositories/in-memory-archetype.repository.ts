import { Injectable } from '@nestjs/common';

import { InMemoryRepository } from '@dod/core';

import { Archetype } from '@/lore/entities/archetype.entity';
import { ArchetypeRepository } from '@/lore/repositories/archetype.repository';

@Injectable()
export class InMemoryArchetypeRepository
  extends InMemoryRepository<Archetype>
  implements ArchetypeRepository
{
  protected get entityName(): string {
    return 'Archetype';
  }

  protected override key(entity: Archetype): string {
    return `${entity.universeId}:${entity.id}`;
  }
}
