import { Inject } from '@nestjs/common';

import { PrismaRepository } from '@dod/core';

import { Card } from '@/lore/entities/card.entity';
import { CardRepository } from '@/lore/repositories/card.repository';

import { Card as CardModel, Prisma } from '../../../prisma/generated';
import { PrismaService } from '../prisma.service';

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
