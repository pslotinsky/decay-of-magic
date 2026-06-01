import type { GuineaPig } from '../guinea-pig/guinea-pig';

/**
 * One side of a Protocol: the Guinea Pig that plays it and the Criterion it
 * consults. The (Guinea Pig, Criterion) pair is independent per side —
 * identical across sides for normal experiments, divergent for comparisons.
 */
export class Side {
  public constructor(
    public readonly guineaPig: GuineaPig,
    public readonly criterionId: string,
  ) {}
}
