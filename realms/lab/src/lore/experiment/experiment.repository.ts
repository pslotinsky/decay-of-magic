import { EntityRepository } from '@dod/core';

import type { Experiment } from './experiment.entity';

/** Persists Experiments, including their Trials and Findings. */
export abstract class ExperimentRepository extends EntityRepository<Experiment> {}
