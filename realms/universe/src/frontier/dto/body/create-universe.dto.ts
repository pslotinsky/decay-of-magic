import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUniverseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  public id!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  public name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  public description?: string;

  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  public cover?: string;
}
