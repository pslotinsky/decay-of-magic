import type {
  Action,
  BattleDto,
  BattleEngine,
  CombatantId,
  Rng,
} from '@dod/engine';

/** Scores a battle state from one Combatant's perspective. */
export type StateScore = (state: BattleDto, perspective: CombatantId) => number;

/** Everything a Guinea Pig needs to choose at one decision point. */
export type Decision = {
  engine: BattleEngine;
  perspective: CombatantId;
  actions: Action[];
  rng: Rng;
  score: StateScore;
};
