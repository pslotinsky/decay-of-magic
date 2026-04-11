import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Card } from '@/lore/entities/card.entity';
import { CardRepository } from '@/lore/repositories/card.repository';

export class FindCardsQuery extends Query<Card[]> {}

@QueryHandler(FindCardsQuery)
export class FindCardsHandler implements IQueryHandler<FindCardsQuery> {
  @Inject() private readonly cardRepository!: CardRepository;

  public async execute(): Promise<Card[]> {
    return this.cardRepository.find();
  }
}
