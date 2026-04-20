import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { CardDto, CardSchema } from '@dod/api-contract';

import { CardRepository } from '@/lore/repositories/card.repository';

export class GetCardQuery extends Query<CardDto> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetCardQuery)
export class GetCardHandler implements IQueryHandler<GetCardQuery> {
  @Inject() private readonly cardRepository!: CardRepository;

  public async execute({ id }: GetCardQuery): Promise<CardDto> {
    const card = await this.cardRepository.getByIdOrFail(id);
    return CardSchema.parse(card);
  }
}
