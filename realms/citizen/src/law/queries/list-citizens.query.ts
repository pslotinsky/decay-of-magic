import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { CitizenDto, CitizenSchema } from '@dod/api-contract';

import { CitizenRepository } from '@/lore/repositories/citizen.repository';

export class ListCitizensQuery extends Query<CitizenDto[]> {}

@QueryHandler(ListCitizensQuery)
export class ListCitizensHandler implements IQueryHandler<ListCitizensQuery> {
  @Inject() private readonly citizenRepository!: CitizenRepository;

  public async execute(): Promise<CitizenDto[]> {
    const citizens = await this.citizenRepository.find();
    return citizens.map((citizen) => CitizenSchema.parse(citizen));
  }
}
