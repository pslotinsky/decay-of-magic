import type {
  Action,
  BattleDto,
  BattleEngine,
  CombatantId,
  Rng,
} from '@dod/engine';

import type { GuineaPig } from '../guinea-pig/guinea-pig';
import type { Criterion } from '../scoring/criterion.entity';
import type { CriterionScorer } from '../scoring/criterion-scorer';

/**
 * One side as it plays a Trial: a Guinea Pig bound to the Criterion it consults
 * and the engine/RNG it acts on. It assembles each Decision — handing the
 * Guinea Pig the legal actions and a score function fixed to its Criterion —
 * and scores states the same way for the Observation log.
 */
export class Contestant {
  public constructor(
    private readonly guineaPig: GuineaPig,
    private readonly criterion: Criterion,
    private readonly scorer: CriterionScorer,
    private readonly engine: BattleEngine,
    private readonly rng: Rng,
  ) {}

  public pick(perspective: CombatantId, actions: Action[]): Action {
    return this.guineaPig.pick({
      engine: this.engine,
      perspective,
      actions,
      rng: this.rng,
      score: (state, subject) => this.score(state, subject),
    });
  }

  public score(state: BattleDto, perspective: CombatantId): number {
    return this.scorer.score(this.criterion, state, perspective);
  }
}
