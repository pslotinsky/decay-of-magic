import { Query } from '@nestjs/cqrs';

import { UniverseDto } from '@/frontier/dto/universe.dto';

export class GetUniverseQuery extends Query<UniverseDto> {
  constructor(public readonly id: string) {
    super();
  }
}
