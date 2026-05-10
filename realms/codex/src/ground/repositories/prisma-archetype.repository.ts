import { Inject, Injectable } from '@nestjs/common';

import { PrismaRepository } from '@dod/core';

import { ArchetypeFactory } from '@/lore/archetype-factory';
import { Archetype, ArchetypeKind } from '@/lore/entities/archetype.entity';
import { ArchetypeRepository } from '@/lore/repositories/archetype.repository';

import { Archetype as ArchetypeModel, Prisma } from '../../../prisma/generated';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaArchetypeRepository
  extends PrismaRepository<Archetype, ArchetypeModel>
  implements ArchetypeRepository
{
  @Inject() private readonly prisma!: PrismaService;
  @Inject() private readonly factory!: ArchetypeFactory;

  protected override get delegate(): Prisma.ArchetypeDelegate {
    return this.prisma.archetype;
  }

  public override async save(entity: Archetype): Promise<void> {
    const data = this.toCreateInput(entity);
    await this.delegate.upsert({
      where: {
        universeId_id: { universeId: data.universeId, id: data.id },
      },
      create: data,
      update: data,
    });
  }

  protected override toEntity(model: ArchetypeModel): Archetype {
    const payload = (model.payload ?? {}) as Record<string, unknown>;
    return this.factory.create(model.kind as ArchetypeKind, {
      id: model.id,
      universeId: model.universeId,
      name: model.name,
      ...payload,
    });
  }

  protected override toModel(entity: Archetype): ArchetypeModel {
    const input = this.toCreateInput(entity);
    return { ...input, payload: input.payload as Prisma.JsonValue };
  }

  private toCreateInput(
    entity: Archetype,
  ): Prisma.ArchetypeUncheckedCreateInput {
    const dto = entity.toDto() as Record<string, unknown>;
    const { id, universeId, name, ...rest } = dto;
    return {
      id: id as string,
      universeId: universeId as string,
      kind: entity.kind,
      name: name as string,
      payload: rest as Prisma.InputJsonValue,
    };
  }
}
