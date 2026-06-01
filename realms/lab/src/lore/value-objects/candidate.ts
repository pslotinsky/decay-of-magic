import type { Action } from '@dod/engine';

/**
 * One legal action considered at a decision point, with the score it would
 * produce. The score is absent for the random character, which does not score.
 */
export class Candidate {
  public constructor(
    public readonly action: Action,
    public readonly score?: number,
  ) {}
}
