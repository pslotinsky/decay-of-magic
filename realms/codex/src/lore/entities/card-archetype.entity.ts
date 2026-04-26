import { CardDto, CreateCardDto } from '@dod/api-contract';

import { Archetype, ArchetypeKind } from './archetype.entity';

type CardData = Omit<CardDto, 'id' | 'universeId' | 'name'>;

/**
 * The primary playable object's prototype. Cards live in decks, are played by
 * spending their Cost, and either resolve immediately as spells or summon a
 * persistent minion onto the battlefield. Summon-style cards carry the
 * minion's stats and traits inline.
 */
export class CardArchetype extends Archetype {
  public readonly kind: ArchetypeKind = ArchetypeKind.Card;
  public data: CardData;

  public constructor(dto: CreateCardDto) {
    const { id, universeId, name, ...data } = dto;
    super({ id, universeId, name });
    this.data = data;
  }

  public override toDto(): CardDto {
    return {
      ...super.toDto(),
      ...this.data,
    };
  }
}
