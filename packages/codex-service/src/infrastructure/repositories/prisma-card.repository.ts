import { Inject, NotFoundException } from '@nestjs/common';

import { Card } from '@service/domain/entities/card.entity';
import { CardRepository } from '@service/domain/repositories/card.repository';

import { PrismaService } from '../prisma.service';

export class PrismaCardRepository implements CardRepository {
  @Inject() private readonly prisma: PrismaService;

  public async getById(id: string): Promise<Card | undefined> {
    const model = await this.prisma.card.findFirst({ where: { id } });

    return model ? Card.create(model) : undefined;
  }

  public async getByIdOrFail(id: string): Promise<Card> {
    const card = await this.getById(id);

    if (!card) {
      throw new NotFoundException(`Card ${id} not found`);
    }

    return card;
  }

  public async find(): Promise<Card[]> {
    const models = await this.prisma.card.findMany();

    return models.map((model) => Card.create(model));
  }

  public async save(card: Card): Promise<void> {
    await this.prisma.card.create({ data: card });
  }
}
