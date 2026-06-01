import type { CombatantId } from '../contract';
import type { StatBlock } from '../stats';

export interface MinionDto {
  id: string;
  archetypeId: string;
  controllerId: CombatantId;
  slot: number;
  stats: StatBlock;
  traits: string[];
}

/** A minion in play — a unit a combatant controls, occupying a slot. */
export class Minion {
  public constructor(
    public readonly id: string,
    public readonly archetypeId: string,
    public readonly controllerId: CombatantId,
    public readonly slot: number,
    public readonly stats: StatBlock,
    public readonly traits: string[],
  ) {}

  public static from(dto: MinionDto): Minion {
    return new Minion(
      dto.id,
      dto.archetypeId,
      dto.controllerId,
      dto.slot,
      { ...dto.stats },
      [...dto.traits],
    );
  }

  public toDto(): MinionDto {
    return {
      id: this.id,
      archetypeId: this.archetypeId,
      controllerId: this.controllerId,
      slot: this.slot,
      stats: { ...this.stats },
      traits: [...this.traits],
    };
  }

  public get attack(): number {
    return this.stats.attack ?? 0;
  }
}
