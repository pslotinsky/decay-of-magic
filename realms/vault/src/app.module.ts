import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { FileGate } from './frontier/gates/file.gate';
import { HealthGate } from './frontier/gates/health.gate';
import { UploadFileUseCase } from './law/commands/upload-file.command';

@Module({
  imports: [CqrsModule, TerminusModule],
  controllers: [FileGate, HealthGate],
  providers: [UploadFileUseCase],
})
export class AppModule {}
