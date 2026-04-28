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
  CreateElementDto,
  CreateElementSchema,
  ElementDto,
  UpdateElementDto,
  UpdateElementSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateArchetypeCommand } from '@/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '@/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '@/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '@/law/queries/list-archetypes.query';
import { ArchetypeKind } from '@/lore/entities/archetype.entity';

@Controller('/v1/element')
export class ElementGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateElementSchema) dto: CreateElementDto,
  ): Promise<ElementDto> {
    return this.commandBus.execute(
      new CreateArchetypeCommand<ElementDto>(ArchetypeKind.Element, dto),
    );
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @ZodBody(UpdateElementSchema) dto: UpdateElementDto,
  ): Promise<ElementDto> {
    return this.commandBus.execute(
      new UpdateArchetypeCommand<ElementDto>(ArchetypeKind.Element, id, dto),
    );
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<ElementDto> {
    return this.queryBus.execute(
      new GetArchetypeQuery<ElementDto>(ArchetypeKind.Element, id),
    );
  }

  @Get()
  public async list(
    @Query('universeId') universeId: string,
  ): Promise<ElementDto[]> {
    return this.queryBus.execute(
      new ListArchetypesQuery<ElementDto>(ArchetypeKind.Element, universeId),
    );
  }
}
