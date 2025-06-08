import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { CardController } from './api/controllers/card.controller';
import { MagicSchoolController } from './api/controllers/magic-school.controller';
import { GetCardHandler } from './application/queries/get-card.query';
import { FindCardsHandler } from './application/queries/find-cards.query';
import { GetMagicSchoolHandler } from './application/queries/get-magic-school.query';
import { FindMagicSchoolsHandler } from './application/queries/find-magic-school.query';
import { CreateCardHandler } from './application/commands/create-card.command';
import { CreateMagicSchoolHandler } from './application/commands/create-magic-school.command';
import { CardRepository } from './domain/repositories/card.repository';
import { MagicSchoolRepository } from './domain/repositories/magic-school.repository';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { PrismaCardRepository } from './infrastructure/repositories/prisma-card.repository';
import { PrismaMagicSchoolRepository } from './infrastructure/repositories/prisma-magic-school.repository';

const queryHandlers = [
  GetCardHandler,
  FindCardsHandler,
  GetMagicSchoolHandler,
  FindMagicSchoolsHandler,
];
const commandHandlers = [CreateCardHandler, CreateMagicSchoolHandler];
const repositories = [
  {
    provide: CardRepository,
    useClass: PrismaCardRepository,
  },
  {
    provide: MagicSchoolRepository,
    useClass: PrismaMagicSchoolRepository,
  },
];
const services = [PrismaService];

@Module({
  imports: [CqrsModule],
  controllers: [CardController, MagicSchoolController],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
