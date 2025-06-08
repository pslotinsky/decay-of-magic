import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Card } from '@service/domain/entities/card.entity';
import { CardRepository } from '@service/domain/repositories/card.repository';

export class FindCardsQuery {
  constructor() {}
}

@QueryHandler(FindCardsQuery)
export class FindCardsHandler implements IQueryHandler<FindCardsQuery, Card[]> {
  constructor(private readonly cardRepository: CardRepository) {}

  public async execute(): Promise<Card[]> {
    return this.cardRepository.find();
  }
}
