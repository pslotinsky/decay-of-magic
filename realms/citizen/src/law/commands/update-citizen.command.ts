import { Command } from '@nestjs/cqrs';

import { UpdateCitizenDto } from '@/frontier/dto/body/update-citizen.dto';
import { CitizenDto } from '@/frontier/dto/citizen.dto';

export class UpdateCitizenCommand extends Command<CitizenDto> {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateCitizenDto,
  ) {
    super();
  }
}
