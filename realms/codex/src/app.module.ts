import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { CardGate } from './frontier/gates/card.gate';
import { ElementGate } from './frontier/gates/element.gate';
import { FactionGate } from './frontier/gates/faction.gate';
import { HealthGate } from './frontier/gates/health.gate';
import { HeroGate } from './frontier/gates/hero.gate';
import { StatGate } from './frontier/gates/stat.gate';
import { TraitGate } from './frontier/gates/trait.gate';
import { PrismaService } from './ground/prisma.service';

const services = [PrismaService];

@Module({
  imports: [CqrsModule, TerminusModule],
  controllers: [
    HealthGate,
    ElementGate,
    FactionGate,
    StatGate,
    TraitGate,
    CardGate,
    HeroGate,
  ],
  providers: [...services],
})
export class AppModule {}
