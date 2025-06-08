import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMagicSchoolDto {
  @IsString()
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @IsString()
  @ApiProperty()
  public name!: string;

  @IsString()
  @ApiProperty()
  public description!: string;
}
