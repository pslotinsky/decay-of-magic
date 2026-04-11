import { Query } from '@nestjs/cqrs';

import { CitizenDto } from '@/frontier/dto/citizen.dto';

export class ListCitizensQuery extends Query<CitizenDto[]> {}
