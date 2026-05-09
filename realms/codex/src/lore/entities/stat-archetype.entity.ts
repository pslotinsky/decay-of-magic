import { CreateStatDto, StatDto } from '@dod/api-contract';

import { Archetype, ArchetypeKind } from './archetype.entity';

type StatData = Omit<StatDto, 'id' | 'universeId' | 'name'>;

/**
 * A numeric attribute slug a Universe permits on its entities (e.g. attack,
 * health, armor). Declares which entity types it may attach to via
 * `appliesTo`; runtime semantics belong to the engine, not the dictionary.
 * `required` flags whether entity editors render an inline input by default.
 */
export class StatArchetype extends Archetype {
  public readonly kind: ArchetypeKind = ArchetypeKind.Stat;
  public data: StatData;

  public constructor({ id, universeId, name, ...data }: CreateStatDto) {
    super({ id, universeId, name });
    this.data = data;
  }

  public override toDto(): StatDto {
    return {
      ...super.toDto(),
      ...this.data,
    };
  }
}
