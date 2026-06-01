import type { Action } from '@dod/engine';

import type { Character } from '../types';
import type { Decision } from './decision';

/**
 * A configured player used inside Trials: its character (kind) plus the
 * behavior that picks an action at each decision point. Immutable value
 * object, inlined per Protocol side. Concrete subclasses implement each
 * character.
 */
export abstract class GuineaPig {
  public abstract readonly character: Character;

  public abstract pick(decision: Decision): Action;
}
