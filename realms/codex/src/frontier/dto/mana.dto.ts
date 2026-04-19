import { plainToInstance } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { Mana, ManaType } from '@/lore/entities/mana.entity';

export class ManaDto {
  public static from(mana: Mana): ManaDto {
    return plainToInstance(ManaDto, mana);
  }

  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty({ enum: ManaType, enumName: 'ManaType' })
  public type!: ManaType;
}
