import { IsInt, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @IsString()
  @ApiProperty()
  public name!: string;

  @IsString()
  @ApiProperty()
  public imageUrl!: string;

  @IsString()
  @ApiProperty()
  public description!: string;

  @IsInt()
  @Min(1)
  @ApiProperty()
  public level!: number;

  @IsInt()
  @Min(0)
  @ApiProperty()
  public cost!: number;

  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  public manaId!: string;
}
