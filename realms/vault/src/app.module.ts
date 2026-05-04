import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { CoreHttpModule } from '@dod/core';

import { FileGate } from './frontier/gates/file.gate';
import { HealthGate } from './frontier/gates/health.gate';
import { TransformFileUseCase } from './law/commands/transform-file.command';
import { UploadFileUseCase } from './law/commands/upload-file.command';

@Module({
  imports: [CoreHttpModule, CqrsModule, TerminusModule],
  controllers: [FileGate, HealthGate],
  providers: [UploadFileUseCase, TransformFileUseCase],
})
export class AppModule {}
