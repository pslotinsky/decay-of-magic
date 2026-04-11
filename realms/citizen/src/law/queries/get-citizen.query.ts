import { Query } from '@nestjs/cqrs';

import { CitizenDto } from '@/frontier/dto/citizen.dto';

export class GetCitizenQuery extends Query<CitizenDto> {
  constructor(public readonly id: string) {
    super();
  }
}
