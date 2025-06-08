import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { CardController } from '@service/api/controllers/card.controller';
import { GetCardHandler } from '@service/application/queries/get-card.query';
import { FindCardsHandler } from '@service/application/queries/find-cards.query';
import { CreateCardHandler } from '@service/application/commands/create-card.command';
import { CardRepository } from '@service/domain/repositories/card.repository';
import { PrismaCardRepository } from '@service/infrastructure/repositories/prisma-card.repository';
import { PrismaService } from './infrastructure/prisma.service';

const queryHandlers = [GetCardHandler, FindCardsHandler];
const commandHandlers = [CreateCardHandler];
const repositories = [
  {
    provide: CardRepository,
    useClass: PrismaCardRepository,
  },
];
const services = [PrismaService];

@Module({
  imports: [CqrsModule],
  controllers: [CardController],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
