import { EntityRepository } from '@dod/core';

import { Universe } from '../entities/universe.entity';

export abstract class UniverseRepository extends EntityRepository<Universe> {}
