import { Entity } from '@dod/core';

import type { Weight } from '../types';

export type CriterionParams = {
  id: string;
  universeId: string;
  name: string;
  weights: Weight[];
};

/**
 * A named weighted feature set Guinea Pigs consult to score states.
 * Universe-scoped: its weights reference features from that Universe's catalog.
 * Mutable, so designers clone before editing to preserve historical weights.
 */
export class Criterion extends Entity {
  public readonly id: string;
  public readonly universeId: string;
  public name: string;
  public weights: Weight[];

  public constructor(params: CriterionParams) {
    super();
    this.id = params.id;
    this.universeId = params.universeId;
    this.name = params.name;
    this.weights = params.weights;
  }
}
