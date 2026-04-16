import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UniverseGate } from './frontier/gates/universe.gate';

@Module({
  imports: [CqrsModule],
  controllers: [UniverseGate],
  providers: [],
})
export class AppModule {}
