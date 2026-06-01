import { EntityRepository } from '@dod/core';

import type { Criterion } from './criterion.entity';

/** Persists Criteria, scoped and queried per Universe. */
export abstract class CriterionRepository extends EntityRepository<Criterion> {}
