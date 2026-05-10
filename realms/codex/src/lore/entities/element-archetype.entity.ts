import { Archetype, ArchetypeKind } from './archetype.entity';

/**
 * A fundamental kind of currency, affinity, or school in a Universe (e.g.
 * fire, credits, tide). Used as Cost on Cards, as the starting pool on Heroes,
 * and as a mechanical axis for abilities.
 */
export class ElementArchetype extends Archetype {
  public readonly kind: ArchetypeKind = ArchetypeKind.Element;
}
