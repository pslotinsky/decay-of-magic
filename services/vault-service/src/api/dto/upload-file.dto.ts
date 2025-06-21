import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiPropertyOptional()
  public id?: string;

  @ApiPropertyOptional()
  public category?: string;

  @ApiProperty({ format: 'binary' })
  public file: string;
}
