import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { CardGate } from './frontier/gates/card.gate';
import { HealthGate } from './frontier/gates/health.gate';
import { ManaGate } from './frontier/gates/mana.gate';
import { PrismaService } from './ground/prisma.service';
import { PrismaCardRepository } from './ground/repositories/prisma-card.repository';
import { PrismaManaRepository } from './ground/repositories/prisma-mana.repository';
import { CreateCardHandler } from './law/commands/create-card.command';
import { CreateManaHandler } from './law/commands/create-mana.command';
import { GetCardHandler } from './law/queries/get-card.query';
import { GetManaHandler } from './law/queries/get-mana.query';
import { ListCardsHandler } from './law/queries/list-cards.query';
import { ListManaHandler } from './law/queries/list-mana.query';
import { CardRepository } from './lore/repositories/card.repository';
import { ManaRepository } from './lore/repositories/mana.repository';

const queryHandlers = [
  GetCardHandler,
  ListCardsHandler,
  GetManaHandler,
  ListManaHandler,
];
const commandHandlers = [CreateCardHandler, CreateManaHandler];
const repositories = [
  {
    provide: CardRepository,
    useClass: PrismaCardRepository,
  },
  {
    provide: ManaRepository,
    useClass: PrismaManaRepository,
  },
];
const services = [PrismaService];

@Module({
  imports: [CqrsModule, TerminusModule],
  controllers: [CardGate, HealthGate, ManaGate],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
