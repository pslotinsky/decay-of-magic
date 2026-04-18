import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UniverseGate } from './frontier/gates/universe.gate';
import { PrismaService } from './ground/prisma.service';
import { PrismaUniverseRepository } from './ground/repositories/prisma-universe.repository';
import { CreateUniverseHandler } from './law/commands/create-universe.command';
import { UpdateUniverseHandler } from './law/commands/update-universe.command';
import { GetUniverseHandler } from './law/queries/get-universe.query';
import { ListUniversesHandler } from './law/queries/list-universes.query';
import { UniverseRepository } from './lore/repositories/universe.repository';

const commandHandlers = [CreateUniverseHandler, UpdateUniverseHandler];
const queryHandlers = [GetUniverseHandler, ListUniversesHandler];
const repositories = [
  { provide: UniverseRepository, useClass: PrismaUniverseRepository },
];
const services = [PrismaService];

@Module({
  imports: [CqrsModule],
  controllers: [UniverseGate],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
