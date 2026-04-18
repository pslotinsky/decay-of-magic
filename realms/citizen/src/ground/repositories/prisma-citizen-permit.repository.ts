import { Inject } from '@nestjs/common';

import { PrismaRepository } from '@dod/core';

import { CitizenPermit } from '@/lore/entities/citizen-permit.entity';
import { CitizenPermitRepository } from '@/lore/repositories/citizen-permit.repository';

import {
  CitizenPermit as CitizenPermitModel,
  Prisma,
} from '../../../prisma/generated';
import { PrismaService } from '../prisma.service';

export class PrismaCitizenPermitRepository
  extends PrismaRepository<CitizenPermit, CitizenPermitModel>
  implements CitizenPermitRepository
{
  @Inject() private readonly prisma!: PrismaService;

  protected override get delegate(): Prisma.CitizenPermitDelegate {
    return this.prisma.citizenPermit;
  }

  protected override toEntity(model: CitizenPermitModel): CitizenPermit {
    return CitizenPermit.create(model);
  }

  protected override toModel(entity: CitizenPermit): CitizenPermitModel {
    return entity;
  }
}
