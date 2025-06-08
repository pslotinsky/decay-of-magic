import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Card } from '@service/domain/entities/card.entity';
import { CardRepository } from '@service/domain/repositories/card.repository';

export class FindCardsQuery extends Query<Card[]> {}

@QueryHandler(FindCardsQuery)
export class FindCardsHandler implements IQueryHandler<FindCardsQuery> {
  constructor(private readonly cardRepository: CardRepository) {}

  public async execute(): Promise<Card[]> {
    return this.cardRepository.find();
  }
}
