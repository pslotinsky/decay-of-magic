import type { CombatantId } from '../contract';

export interface TurnDto {
  activeCombatantId: CombatantId;
  number: number;
}

/** Whose turn it is, and the turn counter. */
export class Turn {
  public constructor(
    public readonly activeCombatantId: CombatantId,
    public readonly number: number,
  ) {}

  public static from(dto: TurnDto): Turn {
    return new Turn(dto.activeCombatantId, dto.number);
  }

  public toDto(): TurnDto {
    return { activeCombatantId: this.activeCombatantId, number: this.number };
  }

  public next(activeCombatantId: CombatantId): Turn {
    return new Turn(activeCombatantId, this.number + 1);
  }
}
