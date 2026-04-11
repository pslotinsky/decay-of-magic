import { Inject } from '@nestjs/common';
import { Prisma, Mana as ManaModel } from '@prisma/client';

import { PrismaRepository } from '@dod/core';

import { Mana, ManaType } from '@/lore/entities/mana.entity';
import { ManaRepository } from '@/lore/repositories/mana.repository';

import { PrismaService } from '../prisma/prisma.service';

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
