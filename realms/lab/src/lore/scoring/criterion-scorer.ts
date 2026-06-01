import {
  Battle,
  type BattleDto,
  BattleEvalContext,
  type CombatantId,
  type ExpressionDefinition,
  ExpressionFactory,
} from '@dod/engine';

import type { Criterion } from './criterion.entity';
import type { Feature } from './feature';

/**
 * Scores a battle state for one Combatant under a Criterion: the dot product
 * Σ weight·feature, evaluating each weighted feature's expression from that
 * Combatant's perspective. A single comparable number per state.
 */
export class CriterionScorer {
  private readonly factory = new ExpressionFactory();
  private readonly features: Map<string, Feature>;

  public constructor(features: Feature[]) {
    this.features = new Map(features.map((feature) => [feature.name, feature]));
  }

  public score(
    criterion: Criterion,
    state: BattleDto,
    perspective: CombatantId,
  ): number {
    const ctx = new BattleEvalContext(Battle.from(state), perspective);
    return criterion.weights.reduce((total, weight) => {
      const value = this.factory
        .from(this.getExpression(weight.feature))
        .evaluateNumber(ctx);
      return total + weight.weight * value;
    }, 0);
  }

  private getExpression(name: string): ExpressionDefinition {
    const feature = this.features.get(name);

    if (feature === undefined) {
      throw new Error(`Feature "${name}" is not in the catalog`);
    }

    return feature.expression;
  }
}
