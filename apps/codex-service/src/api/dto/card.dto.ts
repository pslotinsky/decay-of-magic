import { ApiProperty } from '@nestjs/swagger';

export class CardDto {
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
