import type { CombatantId, Outcome } from '../contract';
import { Combatant, type CombatantDto } from './Combatant';
import type { Hero } from './Hero';
import { Minion, type MinionDto } from './Minion';
import { Turn, type TurnDto } from './Turn';

export interface BattleDto {
  combatants: CombatantDto[];
  minions: MinionDto[];
  turn: TurnDto;
  outcome: Outcome | null;
}

/** The full battle state: combatants, minions in play, the turn, and outcome. */
export class Battle {
  public constructor(
    public readonly combatants: Combatant[],
    public readonly minions: Minion[],
    public turn: Turn,
    public outcome: Outcome | null,
  ) {}

  public static from(dto: BattleDto): Battle {
    return new Battle(
      dto.combatants.map(Combatant.from),
      dto.minions.map(Minion.from),
      Turn.from(dto.turn),
      dto.outcome,
    );
  }

  public toDto(): BattleDto {
    return {
      combatants: this.combatants.map((combatant) => combatant.toDto()),
      minions: this.minions.map((minion) => minion.toDto()),
      turn: this.turn.toDto(),
      outcome: this.outcome,
    };
  }

  public clone(): Battle {
    return Battle.from(this.toDto());
  }

  public getCombatant(id: CombatantId): Combatant {
    const found = this.combatants.find((combatant) => combatant.id === id);

    if (found === undefined) {
      throw new Error(`No combatant "${id}" in battle`);
    }

    return found;
  }

  public getActiveCombatant(): Combatant {
    return this.getCombatant(this.turn.activeCombatantId);
  }

  public getOpponent(id: CombatantId): Combatant {
    const found = this.combatants.find((combatant) => combatant.id !== id);

    if (found === undefined) {
      throw new Error(`No opponent for "${id}" in battle`);
    }

    return found;
  }

  public getHero(id: CombatantId): Hero {
    return this.getCombatant(id).hero;
  }

  public getMinionsOf(id: CombatantId): Minion[] {
    return this.minions.filter((minion) => minion.controllerId === id);
  }

  public summon(minion: Minion): void {
    this.minions.push(minion);
  }

  public advanceTo(activeCombatantId: CombatantId): void {
    this.turn = this.turn.next(activeCombatantId);
  }

  public end(outcome: Outcome): void {
    this.outcome = outcome;
  }
}
