import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FileGate } from './frontier/controllers/file.gate';
import { UploadFileUseCase } from './law/commands/upload-file.command';

@Module({
  imports: [CqrsModule],
  controllers: [FileGate],
  providers: [UploadFileUseCase],
})
export class AppModule {}
