import { Command } from '@nestjs/cqrs';

import { CreateUniverseDto } from '@/frontier/dto/body/create-universe.dto';
import { UniverseDto } from '@/frontier/dto/universe.dto';

export class CreateUniverseCommand extends Command<UniverseDto> {
  constructor(public readonly payload: CreateUniverseDto) {
    super();
  }
}
