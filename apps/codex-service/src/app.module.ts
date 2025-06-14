import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { CardController } from './api/controllers/card.controller';
import { ManaController } from './api/controllers/mana.controller';
import { GetCardHandler } from './application/queries/get-card.query';
import { FindCardsHandler } from './application/queries/find-cards.query';
import { GetManaHandler } from './application/queries/get-mana.query';
import { FindManaHandler } from './application/queries/find-mana.query';
import { CreateCardHandler } from './application/commands/create-card.command';
import { CreateManaHandler } from './application/commands/create-mana.command';
import { CardRepository } from './domain/repositories/card.repository';
import { ManaRepository } from './domain/repositories/mana.repository';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { PrismaCardRepository } from './infrastructure/repositories/prisma-card.repository';
import { PrismaManaRepository } from './infrastructure/repositories/prisma-mana.repository';

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
  controllers: [CardController, ManaController],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
