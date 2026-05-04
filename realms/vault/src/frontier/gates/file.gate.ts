import {
  Controller,
  HttpCode,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileDto, UploadFileDto, UploadFileSchema } from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { UploadFileCommand } from '@/law/commands/upload-file.command';
import { File } from '@/lore/file.entity';
import { FileTransform } from '@/lore/file-transform';

@Controller('/v1/file')
export class FileGate {
  @Inject()
  private commandBus!: CommandBus;

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @ZodBody(UploadFileSchema) body: UploadFileDto,
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<FileDto> {
    const { transform, ...rest } = body;

    const file = File.create({
      ...rest,
      buffer: uploadedFile.buffer,
      name: uploadedFile.originalname,
      mimetype: uploadedFile.mimetype,
    });

    return this.commandBus.execute(
      new UploadFileCommand(file, transform as FileTransform | undefined),
    );
  }
}
