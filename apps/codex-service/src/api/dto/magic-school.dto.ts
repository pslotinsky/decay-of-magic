import { ApiProperty } from '@nestjs/swagger';

export class MagicSchoolDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public description!: string;
}
