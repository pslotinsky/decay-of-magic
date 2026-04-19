import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateCardDto } from '@/frontier/dto/body/create-card.dto';
import { CardDto } from '@/frontier/dto/card.dto';
import { CreateCardCommand } from '@/law/commands/create-card.command';
import { GetCardQuery } from '@/law/queries/get-card.query';
import { ListCardsQuery } from '@/law/queries/list-cards.query';

@Controller('/v1/card')
@ApiTags('Card')
export class CardGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: CardDto })
  public async create(@Body() dto: CreateCardDto): Promise<CardDto> {
    return this.commandBus.execute(new CreateCardCommand(dto));
  }

  @Get('/:id')
  @ApiOkResponse({ type: CardDto })
  public async getById(@Param('id') id: string): Promise<CardDto> {
    return this.queryBus.execute(new GetCardQuery(id));
  }

  @Get()
  @ApiOkResponse({ type: [CardDto] })
  public async list(): Promise<CardDto[]> {
    return this.queryBus.execute(new ListCardsQuery());
  }
}
