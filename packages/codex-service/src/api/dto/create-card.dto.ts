import { IsString, IsNumber } from 'class-validator';

export class CreateCardDto {
  @IsString()
  public id!: string;

  @IsString()
  public name!: string;

  @IsString()
  public description!: string;

  @IsString()
  public schoolId!: string;

  @IsNumber()
  public cost!: number;
}
