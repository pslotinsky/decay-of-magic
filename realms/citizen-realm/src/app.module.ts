import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CitizenGate } from './frontier/gates/citizen.gate';
import { SessionGate } from './frontier/gates/session.gate';

@Module({
  imports: [CqrsModule],
  controllers: [CitizenGate, SessionGate],
})
export class AppModule {}
