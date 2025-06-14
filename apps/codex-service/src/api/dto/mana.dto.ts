import { ApiProperty } from '@nestjs/swagger';

import { ManaType } from '@service/domain/entities/mana.entity';

export class ManaDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty({ enum: ManaType, enumName: 'ManaType' })
  public type!: ManaType;
}
