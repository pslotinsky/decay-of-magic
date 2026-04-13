import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandModule } from 'nestjs-command';

import { AppModule } from '@/app.module';

import { CreateCitizenCli } from './create-citizen.cli';

@Module({
  imports: [AppModule, CqrsModule, CommandModule],
  providers: [CreateCitizenCli],
})
export class CliModule {}
