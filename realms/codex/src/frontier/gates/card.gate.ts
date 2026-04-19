import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CardDto, CreateCardDto, CreateCardSchema } from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateCardCommand } from '@/law/commands/create-card.command';
import { GetCardQuery } from '@/law/queries/get-card.query';
import { ListCardsQuery } from '@/law/queries/list-cards.query';

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
    return this.commandBus.execute(new CreateCardCommand(dto));
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<CardDto> {
    return this.queryBus.execute(new GetCardQuery(id));
  }

  @Get()
  public async list(): Promise<CardDto[]> {
    return this.queryBus.execute(new ListCardsQuery());
  }
}
