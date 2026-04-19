import { plainToInstance } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { File } from '@/lore/file.entity';

export class FileDto {
  public static from(file: File, url: string): FileDto {
    return plainToInstance(FileDto, {
      id: file.id,
      category: file.category,
      name: file.name,
      mimetype: file.mimetype,
      url,
    });
  }

  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public category!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public mimetype!: string;

  @ApiProperty({ format: 'uri' })
  public url!: string;
}
