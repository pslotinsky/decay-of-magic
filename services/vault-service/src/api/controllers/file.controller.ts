import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UploadFileCommand } from '@service/application/commands/upload-file.command';
import { File } from '@service/domain/file.entity';

import { UploadFileDto } from '../dto/upload-file.dto';

@Controller('/v1/file')
@ApiTags('File')
export class FileController {
  @Inject()
  private commandBus: CommandBus;

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({ type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  public async upload(
    @Body() body: UploadFileDto,
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<string> {
    const file = File.create({
      ...body,
      buffer: uploadedFile.buffer,
      name: uploadedFile.originalname,
      mimetype: uploadedFile.mimetype,
    });

    const url = await this.commandBus.execute(new UploadFileCommand(file));

    return url;
  }
}
