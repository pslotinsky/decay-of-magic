import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { ManaType } from '@service/domain/entities/mana.entity';

export class CreateManaDto {
  @IsString()
  @ApiProperty()
  public id!: string;

  @IsString()
  @ApiProperty()
  public name!: string;

  @IsEnum(ManaType)
  @ApiProperty({ enum: ManaType, enumName: 'ManaType' })
  public type!: ManaType;
}
