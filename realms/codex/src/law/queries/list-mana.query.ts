import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { ManaDto } from '@/frontier/dto/mana.dto';
import { ManaRepository } from '@/lore/repositories/mana.repository';

export class ListManaQuery extends Query<ManaDto[]> {}

@QueryHandler(ListManaQuery)
export class ListManaHandler implements IQueryHandler<ListManaQuery> {
  @Inject() private readonly manaRepository!: ManaRepository;

  public async execute(): Promise<ManaDto[]> {
    const mana = await this.manaRepository.find();
    return mana.map((item) => ManaDto.from(item));
  }
}
