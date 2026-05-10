import { Entity } from '@dod/core';
import { pickDefined } from '@dod/core/collection';

export enum ArchetypeKind {
  Element = 'element',
  Faction = 'faction',
  Stat = 'stat',
  Trait = 'trait',
  Card = 'card',
  Hero = 'hero',
}

export type ArchetypeIdentity = {
  id: string;
  universeId: string;
  name: string;
  order?: number;
};

/**
 * Base class for codex content prototypes — designer-authored, universe-scoped
 * definitions of the things that exist in a game. Subclasses split into
 * content (Hero, Card) and dictionaries (Element, Faction, Stat, Trait) that
 * content references.
 */
export abstract class Archetype extends Entity {
  public readonly id: string;
  public readonly universeId: string;
  public name: string;
  public order?: number;

  public abstract readonly kind: ArchetypeKind;

  public constructor(params: ArchetypeIdentity) {
    super();
    this.id = params.id;
    this.universeId = params.universeId;
    this.name = params.name;
    this.order = params.order;
  }

  public override update<T>(fields: Partial<T>): Set<keyof T> {
    const changed = super.update(fields);
    this.enforceInvariants();
    return changed;
  }

  public toDto(): ArchetypeIdentity {
    return pickDefined({
      id: this.id,
      universeId: this.universeId,
      name: this.name,
      order: this.order,
    });
  }

  /**
   * Subclasses override to normalize internal state after a mutation.
   * Called automatically from the constructor and from `update`. Default
   * implementation is a no-op.
   */
  protected enforceInvariants(): void {}
}
