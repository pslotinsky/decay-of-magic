import { Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  CreateUniverseDto,
  CreateUniverseSchema,
  UniverseDto,
  UpdateUniverseDto,
  UpdateUniverseSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateUniverseCommand } from '@/law/commands/create-universe.command';
import { UpdateUniverseCommand } from '@/law/commands/update-universe.command';
import { GetUniverseQuery } from '@/law/queries/get-universe.query';
import { ListUniversesQuery } from '@/law/queries/list-universes.query';

@Controller('/v1/universe')
export class UniverseGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateUniverseSchema) dto: CreateUniverseDto,
  ): Promise<UniverseDto> {
    return this.commandBus.execute(new CreateUniverseCommand(dto));
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @ZodBody(UpdateUniverseSchema) dto: UpdateUniverseDto,
  ): Promise<UniverseDto> {
    return this.commandBus.execute(new UpdateUniverseCommand(id, dto));
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<UniverseDto> {
    return this.queryBus.execute(new GetUniverseQuery(id));
  }

  @Get()
  public async list(): Promise<UniverseDto[]> {
    return this.queryBus.execute(new ListUniversesQuery());
  }
}
