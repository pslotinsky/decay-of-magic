import type { Action } from '@dod/engine';

import { Character } from '../types';
import type { Decision } from './decision';
import { GuineaPig } from './guinea-pig';

/** Picks uniformly at random over the legal actions. The baseline / control. */
export class RandomGuineaPig extends GuineaPig {
  public readonly character = Character.Random;

  public pick(decision: Decision): Action {
    return decision.actions[decision.rng.nextInt(decision.actions.length)];
  }
}
