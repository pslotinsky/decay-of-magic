import { Inject } from '@nestjs/common';
import { Prisma, Card as CardModel } from '@prisma/client';

import { Card } from '@service/domain/entities/card.entity';
import { CardRepository } from '@service/domain/repositories/card.repository';

import { PrismaService } from '../prisma/prisma.service';
import { PrismaRepository } from './prisma.repository';

export class PrismaCardRepository
  extends PrismaRepository<Card, CardModel>
  implements CardRepository
{
  @Inject() private readonly prisma!: PrismaService;

  protected override get delegate(): Prisma.CardDelegate {
    return this.prisma.card;
  }

  protected override toEntity(model: CardModel): Card {
    return Card.create(model);
  }

  protected override toModel(entity: Card): CardModel {
    return entity;
  }
}
