import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { CitizenDto } from '@/frontier/dto/citizen.dto';
import { CitizenRepository } from '@/lore/repositories/citizen.repository';

export class GetCitizenQuery extends Query<CitizenDto> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetCitizenQuery)
export class GetCitizenHandler implements IQueryHandler<GetCitizenQuery> {
  @Inject() private readonly citizenRepository!: CitizenRepository;

  public async execute({ id }: GetCitizenQuery): Promise<CitizenDto> {
    const citizen = await this.citizenRepository.getByIdOrFail(id);

    return CitizenDto.from(citizen);
  }
}
