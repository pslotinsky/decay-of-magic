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
  CreateStatDto,
  CreateStatSchema,
  StatDto,
  UpdateStatDto,
  UpdateStatSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateArchetypeCommand } from '@/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '@/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '@/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '@/law/queries/list-archetypes.query';
import { ArchetypeKind } from '@/lore/entities/archetype.entity';

@Controller('/v1/stat')
export class StatGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateStatSchema) dto: CreateStatDto,
  ): Promise<StatDto> {
    return this.commandBus.execute(
      new CreateArchetypeCommand<StatDto>(ArchetypeKind.Stat, dto),
    );
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @ZodBody(UpdateStatSchema) dto: UpdateStatDto,
  ): Promise<StatDto> {
    return this.commandBus.execute(
      new UpdateArchetypeCommand<StatDto>(ArchetypeKind.Stat, id, dto),
    );
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<StatDto> {
    return this.queryBus.execute(
      new GetArchetypeQuery<StatDto>(ArchetypeKind.Stat, id),
    );
  }

  @Get()
  public async list(
    @Query('universeId') universeId: string,
  ): Promise<StatDto[]> {
    return this.queryBus.execute(
      new ListArchetypesQuery<StatDto>(ArchetypeKind.Stat, universeId),
    );
  }
}
