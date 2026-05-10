import {
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  CreateTraitDto,
  CreateTraitSchema,
  TraitDto,
  UpdateTraitDto,
  UpdateTraitSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateArchetypeCommand } from '@/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '@/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '@/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '@/law/queries/list-archetypes.query';
import { ArchetypeKind } from '@/lore/entities/archetype.entity';

@Controller('/v1/trait')
export class TraitGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateTraitSchema) dto: CreateTraitDto,
  ): Promise<TraitDto> {
    return this.commandBus.execute(
      new CreateArchetypeCommand<TraitDto>(ArchetypeKind.Trait, dto),
    );
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @ZodBody(UpdateTraitSchema) dto: UpdateTraitDto,
  ): Promise<TraitDto> {
    return this.commandBus.execute(
      new UpdateArchetypeCommand<TraitDto>(ArchetypeKind.Trait, id, dto),
    );
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<TraitDto> {
    return this.queryBus.execute(
      new GetArchetypeQuery<TraitDto>(ArchetypeKind.Trait, id),
    );
  }

  @Get()
  public async list(
    @Query('universeId') universeId: string,
  ): Promise<TraitDto[]> {
    return this.queryBus.execute(
      new ListArchetypesQuery<TraitDto>(ArchetypeKind.Trait, universeId),
    );
  }
}
