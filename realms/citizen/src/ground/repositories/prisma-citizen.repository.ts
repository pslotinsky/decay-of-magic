import { Inject } from '@nestjs/common';

import { PrismaRepository } from '@dod/core';

import { Citizen } from '@/lore/entities/citizen.entity';
import { CitizenRepository } from '@/lore/repositories/citizen.repository';

import { Citizen as CitizenModel, Prisma } from '../../../prisma/generated';
import { PrismaService } from '../prisma.service';

export class PrismaCitizenRepository
  extends PrismaRepository<Citizen, CitizenModel>
  implements CitizenRepository
{
  @Inject() private readonly prisma!: PrismaService;

  protected override get delegate(): Prisma.CitizenDelegate {
    return this.prisma.citizen;
  }

  protected override toEntity(model: CitizenModel): Citizen {
    return Citizen.create(model);
  }

  protected override toModel(entity: Citizen): CitizenModel {
    return entity;
  }
}
