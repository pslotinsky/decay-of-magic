import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @IsString()
  @ApiProperty()
  public name!: string;

  @IsString()
  @ApiProperty()
  public description!: string;

  @IsString()
  @ApiProperty({ format: 'uuid' })
  public schoolId!: string;

  @IsNumber()
  @ApiProperty()
  public cost!: number;
}
