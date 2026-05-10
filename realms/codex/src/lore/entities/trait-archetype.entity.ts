import { CreateTraitDto, TraitDto } from '@dod/api-contract';

import { AppliesTo } from '../types';
import { Archetype, ArchetypeKind } from './archetype.entity';

/**
 * A named tag slug a Universe permits on its entities (e.g. wall, charge,
 * spell). Drives keyword abilities, targeting filters, and damage-source
 * classification; declares which entity types it may attach to via
 * `appliesTo`.
 */
export class TraitArchetype extends Archetype {
  public readonly kind: ArchetypeKind = ArchetypeKind.Trait;
  public appliesTo: AppliesTo[];

  public constructor(dto: CreateTraitDto) {
    super(dto);
    this.appliesTo = dto.appliesTo;
  }

  public override toDto(): TraitDto {
    return {
      ...super.toDto(),
      appliesTo: this.appliesTo,
    };
  }
}
