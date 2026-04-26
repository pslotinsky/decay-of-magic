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
  CardDto,
  CreateCardDto,
  CreateCardSchema,
  UpdateCardDto,
  UpdateCardSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateArchetypeCommand } from '@/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '@/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '@/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '@/law/queries/list-archetypes.query';
import { ArchetypeKind } from '@/lore/entities/archetype.entity';

@Controller('/v1/card')
export class CardGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateCardSchema) dto: CreateCardDto,
  ): Promise<CardDto> {
    return this.commandBus.execute(
      new CreateArchetypeCommand<CardDto>(ArchetypeKind.Card, dto),
    );
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @ZodBody(UpdateCardSchema) dto: UpdateCardDto,
  ): Promise<CardDto> {
    return this.commandBus.execute(
      new UpdateArchetypeCommand<CardDto>(ArchetypeKind.Card, id, dto),
    );
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<CardDto> {
    return this.queryBus.execute(
      new GetArchetypeQuery<CardDto>(ArchetypeKind.Card, id),
    );
  }

  @Get()
  public async list(
    @Query('universeId') universeId: string,
  ): Promise<CardDto[]> {
    return this.queryBus.execute(
      new ListArchetypesQuery<CardDto>(ArchetypeKind.Card, universeId),
    );
  }
}
