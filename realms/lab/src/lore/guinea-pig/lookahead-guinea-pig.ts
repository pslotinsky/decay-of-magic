import type { Action } from '@dod/engine';

import { Character } from '../types';
import type { Decision } from './decision';
import { GuineaPig } from './guinea-pig';

/**
 * Searches `depth` plies forward, assuming the opponent uses a symmetric
 * Guinea Pig, and picks the action with the best leaf score. Phase 3.
 */
export class LookaheadGuineaPig extends GuineaPig {
  public readonly character = Character.Lookahead;

  public constructor(public readonly depth: number) {
    super();
  }

  public pick(_decision: Decision): Action {
    throw new Error('Lookahead Guinea Pig is not implemented yet (Phase 3)');
  }
}
