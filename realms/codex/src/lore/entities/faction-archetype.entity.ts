import { CreateFactionDto, FactionDto } from '@dod/api-contract';

import { Archetype, ArchetypeKind } from './archetype.entity';

type FactionData = Omit<FactionDto, 'id' | 'universeId' | 'name' | 'order'>;

/**
 * A grouping of Heroes and Cards inside a Universe. Expresses identity and
 * mechanical synergy; entities may belong to zero, one, or many. Optionally
 * binds to a set of Elements that restrict cost choices for cards in the
 * Faction.
 */
export class FactionArchetype extends Archetype {
  public readonly kind: ArchetypeKind = ArchetypeKind.Faction;
  public data: FactionData;

  public constructor({
    id,
    universeId,
    name,
    order,
    ...data
  }: CreateFactionDto) {
    super({ id, universeId, name, order });
    this.data = data;
  }

  public override toDto(): FactionDto {
    return {
      ...super.toDto(),
      ...this.data,
    };
  }
}
