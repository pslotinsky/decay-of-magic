export interface RulesetDto {
  slotsPerCombatant: number;
  startingHandSize: number;
  drawPerTurn: number;
  turnLimit: number;
}

/** Match configuration: slot count, hand/draw sizes, and the turn limit. */
export class Ruleset {
  public constructor(
    public readonly slotsPerCombatant: number,
    public readonly startingHandSize: number,
    public readonly drawPerTurn: number,
    public readonly turnLimit: number,
  ) {}

  public static from(dto: RulesetDto): Ruleset {
    return new Ruleset(
      dto.slotsPerCombatant,
      dto.startingHandSize,
      dto.drawPerTurn,
      dto.turnLimit,
    );
  }

  public toDto(): RulesetDto {
    return {
      slotsPerCombatant: this.slotsPerCombatant,
      startingHandSize: this.startingHandSize,
      drawPerTurn: this.drawPerTurn,
      turnLimit: this.turnLimit,
    };
  }
}
