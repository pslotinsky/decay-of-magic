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
  CreateHeroDto,
  CreateHeroSchema,
  HeroDto,
  UpdateHeroDto,
  UpdateHeroSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateArchetypeCommand } from '@/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '@/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '@/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '@/law/queries/list-archetypes.query';
import { ArchetypeKind } from '@/lore/entities/archetype.entity';

@Controller('/v1/hero')
export class HeroGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateHeroSchema) dto: CreateHeroDto,
  ): Promise<HeroDto> {
    return this.commandBus.execute(
      new CreateArchetypeCommand<HeroDto>(ArchetypeKind.Hero, dto),
    );
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @ZodBody(UpdateHeroSchema) dto: UpdateHeroDto,
  ): Promise<HeroDto> {
    return this.commandBus.execute(
      new UpdateArchetypeCommand<HeroDto>(ArchetypeKind.Hero, id, dto),
    );
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<HeroDto> {
    return this.queryBus.execute(
      new GetArchetypeQuery<HeroDto>(ArchetypeKind.Hero, id),
    );
  }

  @Get()
  public async list(
    @Query('universeId') universeId: string,
  ): Promise<HeroDto[]> {
    return this.queryBus.execute(
      new ListArchetypesQuery<HeroDto>(ArchetypeKind.Hero, universeId),
    );
  }
}
