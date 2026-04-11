import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Mana } from '@service/lore/entities/mana.entity';
import { ManaRepository } from '@service/lore/repositories/mana.repository';

export class GetManaQuery extends Query<Mana> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetManaQuery)
export class GetManaHandler implements IQueryHandler<GetManaQuery> {
  @Inject() private readonly manaRepository!: ManaRepository;

  public async execute({ id }: GetManaQuery): Promise<Mana> {
    return this.manaRepository.getByIdOrFail(id);
  }
}
