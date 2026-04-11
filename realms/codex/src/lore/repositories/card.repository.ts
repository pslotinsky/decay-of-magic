import { EntityRepository } from '@dod/core';

import { Card } from '../entities/card.entity';

export abstract class CardRepository extends EntityRepository<Card> {}
