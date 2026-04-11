import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { CardGate } from './frontier/gates/card.gate';
import { ManaGate } from './frontier/gates/mana.gate';
import { GetCardHandler } from './law/queries/get-card.query';
import { FindCardsHandler } from './law/queries/find-cards.query';
import { GetManaHandler } from './law/queries/get-mana.query';
import { FindManaHandler } from './law/queries/find-mana.query';
import { CreateCardHandler } from './law/commands/create-card.command';
import { CreateManaHandler } from './law/commands/create-mana.command';
import { CardRepository } from './lore/repositories/card.repository';
import { ManaRepository } from './lore/repositories/mana.repository';
import { PrismaService } from './ground/prisma/prisma.service';
import { PrismaCardRepository } from './ground/repositories/prisma-card.repository';
import { PrismaManaRepository } from './ground/repositories/prisma-mana.repository';

const queryHandlers = [
  GetCardHandler,
  FindCardsHandler,
  GetManaHandler,
  FindManaHandler,
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
  imports: [CqrsModule],
  controllers: [CardGate, ManaGate],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
