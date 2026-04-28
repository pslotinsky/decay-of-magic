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
  CreateFactionDto,
  CreateFactionSchema,
  FactionDto,
  UpdateFactionDto,
  UpdateFactionSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateArchetypeCommand } from '@/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '@/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '@/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '@/law/queries/list-archetypes.query';
import { ArchetypeKind } from '@/lore/entities/archetype.entity';

@Controller('/v1/faction')
export class FactionGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateFactionSchema) dto: CreateFactionDto,
  ): Promise<FactionDto> {
    return this.commandBus.execute(
      new CreateArchetypeCommand<FactionDto>(ArchetypeKind.Faction, dto),
    );
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @ZodBody(UpdateFactionSchema) dto: UpdateFactionDto,
  ): Promise<FactionDto> {
    return this.commandBus.execute(
      new UpdateArchetypeCommand<FactionDto>(ArchetypeKind.Faction, id, dto),
    );
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<FactionDto> {
    return this.queryBus.execute(
      new GetArchetypeQuery<FactionDto>(ArchetypeKind.Faction, id),
    );
  }

  @Get()
  public async list(
    @Query('universeId') universeId: string,
  ): Promise<FactionDto[]> {
    return this.queryBus.execute(
      new ListArchetypesQuery<FactionDto>(ArchetypeKind.Faction, universeId),
    );
  }
}
