import {
  CreateCardDto,
  CreateHeroDto,
  CreateStatDto,
  CreateTraitDto,
} from '@dod/api-contract';

import {
  Archetype,
  ArchetypeIdentity,
  ArchetypeKind,
} from './entities/archetype.entity';
import { CardArchetype } from './entities/card-archetype.entity';
import { ElementArchetype } from './entities/element-archetype.entity';
import { FactionArchetype } from './entities/faction-archetype.entity';
import { HeroArchetype } from './entities/hero-archetype.entity';
import { StatArchetype } from './entities/stat-archetype.entity';
import { TraitArchetype } from './entities/trait-archetype.entity';

/**
 * Constructs Archetype subclass instances from raw payloads, dispatching by
 * ArchetypeKind.
 */
export class ArchetypeFactory {
  public create(kind: ArchetypeKind, payload: unknown): Archetype {
    switch (kind) {
      case ArchetypeKind.Element:
        return new ElementArchetype(payload as ArchetypeIdentity);
      case ArchetypeKind.Faction:
        return new FactionArchetype(payload as ArchetypeIdentity);
      case ArchetypeKind.Stat:
        return new StatArchetype(payload as CreateStatDto);
      case ArchetypeKind.Trait:
        return new TraitArchetype(payload as CreateTraitDto);
      case ArchetypeKind.Card:
        return new CardArchetype(payload as CreateCardDto);
      case ArchetypeKind.Hero:
        return new HeroArchetype(payload as CreateHeroDto);
      default:
        throw new Error(`Unknown archetype kind: ${kind as string}`);
    }
  }
}
