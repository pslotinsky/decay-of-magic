import { Inject } from '@nestjs/common';
import { Prisma, MagicSchool as MagicSchoolModel } from '@prisma/client';

import { MagicSchool } from '@service/domain/entities/magic-school.entity';
import { MagicSchoolRepository } from '@service/domain/repositories/magic-school.repository';

import { PrismaService } from '../prisma/prisma.service';
import { PrismaRepository } from './prisma.repository';

export class PrismaMagicSchoolRepository
  extends PrismaRepository<MagicSchool, MagicSchoolModel>
  implements MagicSchoolRepository
{
  @Inject() private readonly prisma!: PrismaService;

  protected override get delegate(): Prisma.MagicSchoolDelegate {
    return this.prisma.magicSchool;
  }

  protected override toEntity(model: MagicSchoolModel): MagicSchool {
    return MagicSchool.create(model);
  }

  protected override toModel(entity: MagicSchool): MagicSchoolModel {
    return entity;
  }
}
