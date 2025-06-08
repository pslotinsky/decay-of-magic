import { ApiProperty } from '@nestjs/swagger';

export class CardDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public description!: string;

  @ApiProperty({ format: 'uuid' })
  public schoolId!: string;

  @ApiProperty()
  public cost!: number;
}
