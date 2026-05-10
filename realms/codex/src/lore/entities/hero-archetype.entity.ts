import { CreateHeroDto, HeroDto } from '@dod/api-contract';

import { Archetype, ArchetypeKind } from './archetype.entity';

type HeroData = Omit<HeroDto, 'id' | 'universeId' | 'name' | 'order'>;

/**
 * A playable character prototype. Defines identity, an Element pool, optional
 * Stats/Traits/Abilities, and an optional Faction — the player's state at
 * match start.
 */
export class HeroArchetype extends Archetype {
  public readonly kind: ArchetypeKind = ArchetypeKind.Hero;
  public data: HeroData;

  public constructor({ id, universeId, name, order, ...data }: CreateHeroDto) {
    super({ id, universeId, name, order });
    this.data = data;
  }

  public override toDto(): HeroDto {
    return {
      ...super.toDto(),
      ...this.data,
    };
  }
}
