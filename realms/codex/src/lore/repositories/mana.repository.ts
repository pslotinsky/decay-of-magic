import { EntityRepository } from '@dod/core';

import { Mana } from '../entities/mana.entity';

export abstract class ManaRepository extends EntityRepository<Mana> {}
