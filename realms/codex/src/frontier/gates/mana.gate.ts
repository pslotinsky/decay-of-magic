import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateManaDto, CreateManaSchema, ManaDto } from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateManaCommand } from '@/law/commands/create-mana.command';
import { GetManaQuery } from '@/law/queries/get-mana.query';
import { ListManaQuery } from '@/law/queries/list-mana.query';

@Controller('/v1/mana')
export class ManaGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateManaSchema) dto: CreateManaDto,
  ): Promise<ManaDto> {
    return this.commandBus.execute(new CreateManaCommand(dto));
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<ManaDto> {
    return this.queryBus.execute(new GetManaQuery(id));
  }

  @Get()
  public async list(): Promise<ManaDto[]> {
    return this.queryBus.execute(new ListManaQuery());
  }
}
