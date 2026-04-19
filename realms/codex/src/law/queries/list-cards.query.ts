import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { CardDto } from '@/frontier/dto/card.dto';
import { CardRepository } from '@/lore/repositories/card.repository';

export class ListCardsQuery extends Query<CardDto[]> {}

@QueryHandler(ListCardsQuery)
export class ListCardsHandler implements IQueryHandler<ListCardsQuery> {
  @Inject() private readonly cardRepository!: CardRepository;

  public async execute(): Promise<CardDto[]> {
    const cards = await this.cardRepository.find();
    return cards.map((card) => CardDto.from(card));
  }
}
