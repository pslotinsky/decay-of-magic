import { EntityRepository } from '@dod/core';

import { CitizenPermit } from '../entities/citizen-permit.entity';

export abstract class CitizenPermitRepository extends EntityRepository<CitizenPermit> {}
