import { Inject } from '@nestjs/common';
import { PrismaRepository } from '@dod/core';
import { Prisma, Universe as UniverseModel } from '../../../prisma/generated';

import { Universe } from '@/lore/entities/universe.entity';
import { UniverseRepository } from '@/lore/repositories/universe.repository';

import { PrismaService } from '../prisma.service';

export class PrismaUniverseRepository
  extends PrismaRepository<Universe, UniverseModel>
  implements UniverseRepository
{
  @Inject() private readonly prisma!: PrismaService;

  protected override get delegate(): Prisma.UniverseDelegate {
    return this.prisma.universe;
  }

  protected override toEntity(model: UniverseModel): Universe {
    return Universe.create({
      ...model,
      description: model.description ?? undefined,
      cover: model.cover ?? undefined,
    });
  }

  protected override toModel(entity: Universe): UniverseModel {
    return {
      ...entity,
      description: entity.description ?? null,
      cover: entity.cover ?? null,
    };
  }
}
