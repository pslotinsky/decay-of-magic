import { EntityRepository } from '@dod/core';

import { Citizen } from '../entities/citizen.entity';

export abstract class CitizenRepository extends EntityRepository<Citizen> {}
