import { Inject } from '@nestjs/common';
import { Prisma, Mana as ManaModel } from '@prisma/client';

import { Mana, ManaType } from '@service/domain/entities/mana.entity';
import { ManaRepository } from '@service/domain/repositories/mana.repository';

import { PrismaService } from '../prisma/prisma.service';
import { PrismaRepository } from './prisma.repository';

export class PrismaManaRepository
  extends PrismaRepository<Mana, ManaModel>
  implements ManaRepository
{
  @Inject() private readonly prisma!: PrismaService;

  protected override get delegate(): Prisma.ManaDelegate {
    return this.prisma.mana;
  }

  protected override toEntity(model: ManaModel): Mana {
    const { type, ...rest } = model;

    return Mana.create({ type: type as ManaType, ...rest });
  }

  protected override toModel(entity: Mana): ManaModel {
    return entity;
  }
}
