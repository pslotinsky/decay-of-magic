import type { ElementPool, StatBlock } from '../stats';

export interface HeroArchetypeDto {
  id: string;
  stats: StatBlock;
  elements?: ElementPool;
  traits?: string[];
}

/** A hero prototype from the Codex: starting stats, elements, and traits. */
export class HeroArchetype {
  public constructor(
    public readonly id: string,
    public readonly stats: StatBlock,
    public readonly elements?: ElementPool,
    public readonly traits?: string[],
  ) {}

  public static from(dto: HeroArchetypeDto): HeroArchetype {
    return new HeroArchetype(
      dto.id,
      { ...dto.stats },
      dto.elements ? { ...dto.elements } : undefined,
      dto.traits ? [...dto.traits] : undefined,
    );
  }

  public toDto(): HeroArchetypeDto {
    return {
      id: this.id,
      stats: { ...this.stats },
      ...(this.elements ? { elements: { ...this.elements } } : {}),
      ...(this.traits ? { traits: [...this.traits] } : {}),
    };
  }
}
