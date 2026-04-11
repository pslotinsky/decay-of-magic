import { Command } from '@nestjs/cqrs';

import { RegisterCitizenDto } from '@/frontier/dto/body/register-citizen.dto';
import { CitizenDto } from '@/frontier/dto/citizen.dto';

export class RegisterCitizenCommand extends Command<CitizenDto> {
  constructor(public readonly payload: RegisterCitizenDto) {
    super();
  }
}
