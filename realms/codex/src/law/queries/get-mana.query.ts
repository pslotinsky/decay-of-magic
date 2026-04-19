import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { ManaDto } from '@/frontier/dto/mana.dto';
import { ManaRepository } from '@/lore/repositories/mana.repository';

export class GetManaQuery extends Query<ManaDto> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetManaQuery)
export class GetManaHandler implements IQueryHandler<GetManaQuery> {
  @Inject() private readonly manaRepository!: ManaRepository;

  public async execute({ id }: GetManaQuery): Promise<ManaDto> {
    const mana = await this.manaRepository.getByIdOrFail(id);
    return ManaDto.from(mana);
  }
}
