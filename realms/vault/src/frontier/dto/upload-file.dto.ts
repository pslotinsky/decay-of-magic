import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ format: 'uuid' })
  public id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  public category?: string;

  @ApiProperty({ format: 'binary' })
  public file!: string;
}
