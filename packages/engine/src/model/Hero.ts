import type { ElementPool, StatBlock } from '../stats';

export interface HeroDto {
  archetypeId: string;
  stats: StatBlock;
  elements: ElementPool;
  traits: string[];
}

/** A combatant's hero — the avatar holding life, elements, and traits. */
export class Hero {
  public constructor(
    public readonly archetypeId: string,
    public readonly stats: StatBlock,
    public readonly elements: ElementPool,
    public readonly traits: string[],
  ) {}

  public static from(dto: HeroDto): Hero {
    return new Hero(dto.archetypeId, { ...dto.stats }, { ...dto.elements }, [
      ...dto.traits,
    ]);
  }

  public toDto(): HeroDto {
    return {
      archetypeId: this.archetypeId,
      stats: { ...this.stats },
      elements: { ...this.elements },
      traits: [...this.traits],
    };
  }

  public get health(): number {
    return this.stats.health ?? 0;
  }

  public get isDead(): boolean {
    return this.health <= 0;
  }

  public damage(amount: number): number {
    const lifeLost = Math.min(amount, this.health);
    this.stats.health = this.health - amount;
    return lifeLost;
  }

  public affords(cost: ElementPool): boolean {
    return Object.entries(cost).every(
      ([element, amount]) => (this.elements[element] ?? 0) >= amount,
    );
  }

  public spend(cost: ElementPool): void {
    for (const [element, amount] of Object.entries(cost)) {
      this.elements[element] = (this.elements[element] ?? 0) - amount;
    }
  }
}
