import { plainToInstance } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { Card } from '@/lore/entities/card.entity';

export class CardDto {
  public static from(card: Card): CardDto {
    return plainToInstance(CardDto, card);
  }

  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public imageUrl!: string;

  @ApiProperty()
  public description!: string;

  @ApiProperty()
  public level!: number;

  @ApiProperty()
  public cost!: number;

  @ApiProperty()
  public manaId!: string;
}
