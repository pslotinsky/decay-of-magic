import { IllegalActionError } from '../errors/IllegalActionError';
import { CardArchetype, type CardArchetypeDto } from './CardArchetype';
import { HeroArchetype, type HeroArchetypeDto } from './HeroArchetype';

export interface CodexContentDto {
  cards: CardArchetypeDto[];
  heroes: HeroArchetypeDto[];
}

/** The Codex content a battle draws on: card and hero prototypes, by id. */
export class CodexContent {
  public constructor(
    public readonly cards: CardArchetype[],
    public readonly heroes: HeroArchetype[],
  ) {}

  public static from(dto: CodexContentDto): CodexContent {
    return new CodexContent(
      dto.cards.map(CardArchetype.from),
      dto.heroes.map(HeroArchetype.from),
    );
  }

  public toDto(): CodexContentDto {
    return {
      cards: this.cards.map((card) => card.toDto()),
      heroes: this.heroes.map((hero) => hero.toDto()),
    };
  }

  public getCard(id: string): CardArchetype {
    const found = this.cards.find((card) => card.id === id);
    if (found === undefined) {
      throw new IllegalActionError(`Unknown card archetype "${id}"`);
    }
    return found;
  }

  public getHero(id: string): HeroArchetype {
    const found = this.heroes.find((hero) => hero.id === id);
    if (found === undefined) {
      throw new IllegalActionError(`Unknown hero archetype "${id}"`);
    }
    return found;
  }
}
