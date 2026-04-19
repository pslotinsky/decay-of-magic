import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FileDto } from '@/frontier/dto/file.dto';
import { UploadFileCommand } from '@/law/commands/upload-file.command';
import { File } from '@/lore/file.entity';

import { UploadFileDto } from '../dto/upload-file.dto';

@Controller('/v1/file')
@ApiTags('File')
export class FileGate {
  @Inject()
  private commandBus!: CommandBus;

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @ApiCreatedResponse({ type: FileDto })
  public async upload(
    @Body() body: UploadFileDto,
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<FileDto> {
    const file = File.create({
      ...body,
      buffer: uploadedFile.buffer,
      name: uploadedFile.originalname,
      mimetype: uploadedFile.mimetype,
    });

    return this.commandBus.execute(new UploadFileCommand(file));
  }
}
