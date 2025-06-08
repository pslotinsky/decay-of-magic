import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Card } from '@service/domain/entities/card.entity';
import { CardRepository } from '@service/domain/repositories/card.repository';

export class GetCardQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetCardQuery)
export class GetCardHandler implements IQueryHandler<GetCardQuery, Card> {
  constructor(private readonly cardRepository: CardRepository) {}

  public async execute({ id }: GetCardQuery): Promise<Card> {
    return this.cardRepository.getByIdOrFail(id);
  }
}
