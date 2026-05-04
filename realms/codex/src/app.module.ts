import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { CoreHttpModule } from '@dod/core';

import { CardGate } from './frontier/gates/card.gate';
import { ElementGate } from './frontier/gates/element.gate';
import { FactionGate } from './frontier/gates/faction.gate';
import { HealthGate } from './frontier/gates/health.gate';
import { HeroGate } from './frontier/gates/hero.gate';
import { StatGate } from './frontier/gates/stat.gate';
import { TraitGate } from './frontier/gates/trait.gate';
import { PrismaService } from './ground/prisma.service';
import { PrismaArchetypeRepository } from './ground/repositories/prisma-archetype.repository';
import { CreateArchetypeHandler } from './law/commands/create-archetype.command';
import { UpdateArchetypeHandler } from './law/commands/update-archetype.command';
import { GetArchetypeHandler } from './law/queries/get-archetype.query';
import { ListArchetypesHandler } from './law/queries/list-archetypes.query';
import { ArchetypeFactory } from './lore/archetype-factory';
import { ArchetypeRepository } from './lore/repositories/archetype.repository';

const commandHandlers = [CreateArchetypeHandler, UpdateArchetypeHandler];

const queryHandlers = [GetArchetypeHandler, ListArchetypesHandler];

const repositories = [
  { provide: ArchetypeRepository, useClass: PrismaArchetypeRepository },
];

const services = [ArchetypeFactory, PrismaService];

@Module({
  imports: [CoreHttpModule, CqrsModule, TerminusModule],
  controllers: [
    HealthGate,
    ElementGate,
    FactionGate,
    StatGate,
    TraitGate,
    CardGate,
    HeroGate,
  ],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
