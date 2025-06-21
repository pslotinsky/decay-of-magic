import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FileController } from './api/controllers/file.controller';
import { UploadFileUseCase } from './application/commands/upload-file.command';

@Module({
  imports: [CqrsModule],
  controllers: [FileController],
  providers: [UploadFileUseCase],
})
export class AppModule {}
