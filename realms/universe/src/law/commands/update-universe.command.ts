import { Command } from '@nestjs/cqrs';

import { UpdateUniverseDto } from '@/frontier/dto/body/update-universe.dto';
import { UniverseDto } from '@/frontier/dto/universe.dto';

export class UpdateUniverseCommand extends Command<UniverseDto> {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateUniverseDto,
  ) {
    super();
  }
}
