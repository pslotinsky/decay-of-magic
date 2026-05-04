import { Entity } from '@dod/core';

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

  public abstract readonly kind: ArchetypeKind;

  public constructor(params: ArchetypeIdentity) {
    super();
    this.id = params.id;
    this.universeId = params.universeId;
    this.name = params.name;
  }

  public override update<T extends object>(
    this: T,
    params: Partial<T>,
  ): Set<keyof T> {
    const changed = super.update(params) as unknown as Set<keyof T>;
    (this as unknown as Archetype).enforceInvariants();
    return changed;
  }

  public toDto(): ArchetypeIdentity {
    return {
      id: this.id,
      universeId: this.universeId,
      name: this.name,
    };
  }

  /**
   * Subclasses override to normalize internal state after a mutation.
   * Called automatically from the constructor and from `update`. Default
   * implementation is a no-op.
   */
  protected enforceInvariants(): void {}
}
