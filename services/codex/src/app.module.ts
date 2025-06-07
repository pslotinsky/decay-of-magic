import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { CardController } from '@api/controllers/card.controllers';
import { GetCardHandler } from '@application/queries/get-card.query';
import { FindCardsHandler } from '@application/queries/find-cards.query';
import { CreateCardHandler } from '@application/commands/create-card.command';
import { CardRepository } from '@domain/repositories/card.repository';
import { PrismaCardRepository } from '@infrastructure/repositories/prisma-card.repository';

const queryHandlers = [GetCardHandler, FindCardsHandler];
const commandHandlers = [CreateCardHandler];
const repositories = [
  {
    provide: CardRepository,
    useClass: PrismaCardRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [CardController],
  providers: [...queryHandlers, ...commandHandlers, ...repositories],
})
export class AppModule {}
