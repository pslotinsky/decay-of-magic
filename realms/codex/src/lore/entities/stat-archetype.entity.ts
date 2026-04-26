import { CreateStatDto, StatDto } from '@dod/api-contract';

import { AppliesTo } from '../types';
import { Archetype, ArchetypeKind } from './archetype.entity';

/**
 * A numeric attribute slug a Universe permits on its entities (e.g. attack,
 * health, armor). Declares which entity types it may attach to via
 * `appliesTo`; runtime semantics belong to the engine, not the dictionary.
 */
export class StatArchetype extends Archetype {
  public readonly kind: ArchetypeKind = ArchetypeKind.Stat;
  public appliesTo: AppliesTo[];

  public constructor(dto: CreateStatDto) {
    super(dto);
    this.appliesTo = dto.appliesTo;
  }

  public override toDto(): StatDto {
    return {
      ...super.toDto(),
      appliesTo: this.appliesTo,
    };
  }
}
