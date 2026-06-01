import type { Activation } from '../BattleEngine';
import {
  type EvalContext,
  type ExpressionDefinition,
  ExpressionFactory,
} from '../expression';
import type { ElementPool, StatBlock } from '../stats';

export interface CardArchetypeDto {
  id: string;
  cost?: ElementPool;
  stats?: Record<string, ExpressionDefinition>;
  activation: Activation;
}

/** A card prototype from the Codex: its cost, stat formulas, and activation. */
export class CardArchetype {
  public constructor(
    public readonly id: string,
    public readonly activation: Activation,
    public readonly cost?: ElementPool,
    public readonly stats?: Record<string, ExpressionDefinition>,
  ) {}

  public static from(dto: CardArchetypeDto): CardArchetype {
    return new CardArchetype(
      dto.id,
      dto.activation,
      dto.cost ? { ...dto.cost } : undefined,
      dto.stats ? { ...dto.stats } : undefined,
    );
  }

  public toDto(): CardArchetypeDto {
    return {
      id: this.id,
      activation: this.activation,
      ...(this.cost ? { cost: { ...this.cost } } : {}),
      ...(this.stats ? { stats: { ...this.stats } } : {}),
    };
  }

  public rollStats(factory: ExpressionFactory, ctx: EvalContext): StatBlock {
    const stats: StatBlock = {};
    for (const [stat, expression] of Object.entries(this.stats ?? {})) {
      stats[stat] = factory.from(expression).evaluateNumber(ctx);
    }
    return stats;
  }
}
