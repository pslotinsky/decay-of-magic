import { Archetype, ArchetypeKind } from './archetype.entity';

/**
 * A grouping of Heroes and Cards inside a Universe. Expresses identity and
 * mechanical synergy; entities may belong to zero, one, or many.
 */
export class FactionArchetype extends Archetype {
  public readonly kind: ArchetypeKind = ArchetypeKind.Faction;
}
