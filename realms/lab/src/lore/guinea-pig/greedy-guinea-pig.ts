import type { Action } from '@dod/engine';

import { Character } from '../types';
import type { Decision } from './decision';
import { GuineaPig } from './guinea-pig';

/**
 * For each legal action, peeks the resulting state, scores it via the
 * Criterion, and picks the highest. One-ply greedy.
 */
export class GreedyGuineaPig extends GuineaPig {
  public readonly character = Character.Greedy;

  public pick(decision: Decision): Action {
    const scored = decision.actions.map((action) => ({
      action,
      value: decision.score(
        decision.engine.peek(action).observe().battle,
        decision.perspective,
      ),
    }));

    return scored.reduce((best, candidate) =>
      candidate.value > best.value ? candidate : best,
    ).action;
  }
}
