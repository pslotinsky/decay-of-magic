import { IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  public nickname!: string;

  @IsString()
  public secret!: string;
}
