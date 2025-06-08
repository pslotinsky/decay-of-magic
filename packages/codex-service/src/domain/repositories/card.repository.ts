import { Card } from '../entities/card.entity';
import { EntityRepository } from './entity.repository';

export abstract class CardRepository extends EntityRepository<Card> {}
