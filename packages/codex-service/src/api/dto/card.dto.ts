import { IsString, IsNumber } from 'class-validator';

export class CardDto {
  @IsString()
  public id: string;

  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  public schoolId: string;

  @IsNumber()
  public cost: number;
}
