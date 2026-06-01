export interface CardDto {
  id: string;
  archetypeId: string;
}

/** A card instance in a combatant's hand or deck. */
export class Card {
  public constructor(
    public readonly id: string,
    public readonly archetypeId: string,
  ) {}

  public static from(dto: CardDto): Card {
    return new Card(dto.id, dto.archetypeId);
  }

  public toDto(): CardDto {
    return { id: this.id, archetypeId: this.archetypeId };
  }
}
