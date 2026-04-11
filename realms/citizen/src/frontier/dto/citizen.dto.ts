import { plainToInstance } from 'class-transformer';

import { Citizen } from '@/lore/entities/citizen.entity';

export class CitizenDto {
  public static from(citizen: Citizen): CitizenDto {
    return plainToInstance(CitizenDto, citizen);
  }

  public id!: string;
  public nickname!: string;
}
