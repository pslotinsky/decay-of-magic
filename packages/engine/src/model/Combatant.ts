import type { CombatantId } from '../contract';
import { IllegalActionError } from '../errors/IllegalActionError';
import { Card, type CardDto } from './Card';
import { Hero, type HeroDto } from './Hero';

export interface CombatantDto {
  id: CombatantId;
  hero: HeroDto;
  hand: CardDto[];
  deck: CardDto[];
}

/** One side of a battle: a hero plus that player's hand and deck. */
export class Combatant {
  public constructor(
    public readonly id: CombatantId,
    public readonly hero: Hero,
    public readonly hand: Card[],
    public readonly deck: Card[],
  ) {}

  public static from(dto: CombatantDto): Combatant {
    return new Combatant(
      dto.id,
      Hero.from(dto.hero),
      dto.hand.map(Card.from),
      dto.deck.map(Card.from),
    );
  }

  public toDto(): CombatantDto {
    return {
      id: this.id,
      hero: this.hero.toDto(),
      hand: this.hand.map((card) => card.toDto()),
      deck: this.deck.map((card) => card.toDto()),
    };
  }

  public draw(): Card | undefined {
    const card = this.deck.shift();

    if (card !== undefined) {
      this.hand.push(card);
    }

    return card;
  }

  public play(cardId: string): Card {
    const index = this.hand.findIndex((card) => card.id === cardId);

    if (index === -1) {
      throw new IllegalActionError(
        `Card "${cardId}" is not in the active hand`,
      );
    }

    return this.hand.splice(index, 1)[0];
  }
}
