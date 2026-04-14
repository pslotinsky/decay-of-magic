import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterCitizenDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  public nickname!: string;

  @IsString()
  @MinLength(8)
  public secret!: string;
}
