import { Query } from '@nestjs/cqrs';

import { UniverseDto } from '@/frontier/dto/universe.dto';

export class ListUniversesQuery extends Query<UniverseDto[]> {}
