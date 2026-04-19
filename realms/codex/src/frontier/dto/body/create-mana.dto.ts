import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ManaType } from '@/lore/entities/mana.entity';

export class CreateManaDto {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @IsString()
  @ApiProperty()
  public name!: string;

  @IsEnum(ManaType)
  @ApiProperty({ enum: ManaType, enumName: 'ManaType' })
  public type!: ManaType;
}
